"""Blender 4.3: blender -b -t 2 --python scripts/assets/convert_rocketbox.py -- SOURCE_ROOT OUTPUT_ROOT
來源與下載雜湊見 public/models/rocketbox/source.json。保留骨架、材質與三個真實動畫。
"""
import bpy, sys, pathlib, math
source, output = map(pathlib.Path, sys.argv[sys.argv.index('--') + 1:])
for name, gender, slug, prefix in [('Female_Adult_01','f','female','f001'),('Male_Adult_01','m','male','m002')]:
    bpy.ops.wm.read_factory_settings(use_empty=True)
    folder = source / 'Assets/Avatars/Adults' / name
    bpy.ops.import_scene.fbx(filepath=str(folder / 'Export' / (name + '.fbx')))
    rig = next(o for o in bpy.data.objects if o.type == 'ARMATURE')
    rig.animation_data_clear()
    mesh = next(o for o in bpy.data.objects if o.type == 'MESH')
    for face in mesh.data.polygons: face.use_smooth = True
    # 明確重建 FBX 材質，移除原本無效的絕對路徑、Specular 與灰色乘數。
    for material in mesh.data.materials:
        kind = material.name.split('_')[1]
        material.use_nodes = True
        nodes, links = material.node_tree.nodes, material.node_tree.links
        nodes.clear()
        bsdf = nodes.new('ShaderNodeBsdfPrincipled')
        bsdf.inputs['Roughness'].default_value = .78 if kind == 'body' else .62
        bsdf.inputs['Specular IOR Level'].default_value = .25
        out = nodes.new('ShaderNodeOutputMaterial'); links.new(bsdf.outputs['BSDF'], out.inputs['Surface'])
        color = bpy.data.images.load(str(folder/'Textures'/f'{prefix}_{kind}_color.tga'), check_existing=False)
        if kind != 'head': color.scale(1024,1024)
        color.file_format = 'PNG' if kind == 'opacity' else 'JPEG'
        color.pack()
        node = nodes.new('ShaderNodeTexImage'); node.image=color
        links.new(node.outputs['Color'],bsdf.inputs['Base Color'])
        if kind == 'opacity':
            links.new(node.outputs['Alpha'],bsdf.inputs['Alpha'])
            material.surface_render_method = 'DITHERED'
            material.use_backface_culling = False
        else:
            normal = bpy.data.images.load(str(folder/'Textures'/f'{prefix}_{kind}_normal.tga'), check_existing=False)
            normal.colorspace_settings.name='Non-Color'; normal.scale(1024,1024); normal.pack()
            tex=nodes.new('ShaderNodeTexImage');tex.image=normal
            normal_map=nodes.new('ShaderNodeNormalMap');normal_map.inputs['Strength'].default_value=.6
            links.new(tex.outputs['Color'],normal_map.inputs['Color']);links.new(normal_map.outputs['Normal'],bsdf.inputs['Normal'])
    actions=[]
    for clip, category, filename in [('Idle','static',gender+'_idle_breathe_01'),('Walk','xy',gender+'_walk_neutral'),('Run','xy',gender+'_run_neutral')]:
        existing=set(bpy.data.objects)
        bpy.ops.import_scene.fbx(filepath=str(source/'Assets/Animations'/('all_animations_max_motextr_'+category)/(filename+'.max.fbx')))
        imported=set(bpy.data.objects)-existing
        driver=next(o for o in imported if o.type=='ARMATURE')
        start,end=map(int,driver.animation_data.action.frame_range)
        for bone in rig.pose.bones:
            if bone.name not in driver.pose.bones: continue
            c=bone.constraints.new('COPY_ROTATION');c.target=driver;c.subtarget=bone.name;c.owner_space='WORLD';c.target_space='WORLD'
            if bone.name=='Bip01 Pelvis':
                c=bone.constraints.new('COPY_LOCATION');c.target=driver;c.subtarget=bone.name;c.owner_space='WORLD';c.target_space='WORLD';c.use_x=False;c.use_y=False
        bpy.ops.object.select_all(action='DESELECT');rig.select_set(True);bpy.context.view_layer.objects.active=rig
        bpy.ops.nla.bake(frame_start=start,frame_end=end,step=1,only_selected=False,visual_keying=True,clear_constraints=True,use_current_action=False,bake_types={'POSE'})
        action=rig.animation_data.action;action.name=clip;action.use_fake_user=True;actions.append(action)
        rig.animation_data.action=None
        for o in imported:bpy.data.objects.remove(o,do_unlink=True)
        for bone in rig.pose.bones:bone.matrix_basis.identity()
    rig.animation_data_create()
    for action in actions:
        track=rig.animation_data.nla_tracks.new();track.name=action.name
        strip=track.strips.new(action.name,int(action.frame_range[0]),action);strip.name=action.name
        track.mute=True
    # glTF NLA 模式逐一輸出，避免匯出來源動作或重疊混合動作。
    for o in list(bpy.data.objects):
        if o not in [rig,mesh]:bpy.data.objects.remove(o,do_unlink=True)
    bpy.context.scene.frame_set(1)
    output.mkdir(parents=True,exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=str(output/(slug+'.glb')),export_format='GLB',export_animations=True,export_animation_mode='NLA_TRACKS',export_anim_slide_to_zero=True,export_yup=True,export_skins=True)
    print('EXPORTED',slug,(output/(slug+'.glb')).stat().st_size,flush=True)
