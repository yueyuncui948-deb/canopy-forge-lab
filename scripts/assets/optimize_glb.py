"""以 Pillow 將 GLB 的不透明底色轉為 JPEG；法線與透明頭髮保留原 PNG。"""
import io, json, pathlib, struct, sys
from PIL import Image
for filename in sys.argv[1:]:
    path=pathlib.Path(filename); raw=path.read_bytes()
    length=struct.unpack_from('<I',raw,12)[0]; document=json.loads(raw[20:20+length]); binary=raw[28+length:]
    images={image['bufferView']:image for image in document.get('images',[])}
    output=bytearray()
    for index,view in enumerate(document['bufferViews']):
        data=binary[view.get('byteOffset',0):view.get('byteOffset',0)+view['byteLength']]
        image=images.get(index)
        if image and '_color' in image.get('name','') and 'opacity' not in image['name']:
            decoded=Image.open(io.BytesIO(data)).convert('RGB'); encoded=io.BytesIO();decoded.save(encoded,format='JPEG',quality=92,subsampling=0,optimize=True)
            data=encoded.getvalue();image['mimeType']='image/jpeg'
        view['byteOffset']=len(output);view['byteLength']=len(data);output.extend(data)
        output.extend(b'\0'*(-len(output)%4))
    document['buffers'][0]['byteLength']=len(output)
    metadata=json.dumps(document,separators=(',',':'),ensure_ascii=False).encode();metadata+=b' '*(-len(metadata)%4)
    result=struct.pack('<4sII',b'glTF',2,28+len(metadata)+len(output))+struct.pack('<I4s',len(metadata),b'JSON')+metadata+struct.pack('<I4s',len(output),b'BIN\0')+output
    path.write_bytes(result);print(path.name,len(raw),'->',len(result))
