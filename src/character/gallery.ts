import { characters, type Character } from './catalog';
import type { HeroMotion } from './hero';

export function createGallery(parent: HTMLElement, initial: Character, callbacks: {
  select: (character: Character) => Promise<boolean>;
  showcase: (enabled: boolean) => void;
  motion: (motion: HeroMotion) => void;
  view: (close: boolean) => void;
}) {
  const panel = document.createElement('section');
  panel.className = 'gallery';
  panel.setAttribute('aria-label', '人物選擇與展示');
  panel.innerHTML = `<div class="badge">CHARACTER COLLECTION</div><h2>選擇你的行者</h2>
    <div class="character-list">${characters.map(c => `<button type="button" data-character="${c.id}" aria-pressed="false"><strong>${c.name}</strong><span>${c.style}</span></button>`).join('')}</div>
    <p class="character-description"></p><p class="gallery-status" role="status" aria-live="polite"></p>
    <label class="showcase-toggle"><input type="checkbox" id="showcase"> 人物展示 <small>暫停戰鬥</small></label>
    <div class="motion-controls" hidden>${[['idle','待機'],['walk','步行'],['run','跑步'],['jump','跳躍'],['attack','揮劍']].map(([id,label]) => `<button type="button" data-motion="${id}" aria-pressed="${id === 'idle'}">${label}</button>`).join('')}</div>
    <div class="view-controls"><button type="button" data-view="full">全身</button><button type="button" data-view="close">近看</button></div>`;
  parent.append(panel);
  const message = panel.querySelector<HTMLElement>('.gallery-status')!;
  let request = 0;
  function selected(character: Character) {
    panel.querySelectorAll<HTMLButtonElement>('[data-character]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.character === character.id)));
    panel.querySelector('.character-description')!.textContent = character.description;
    const foot = document.querySelector('.foot')!;
    foot.textContent = `${character.credit} · `;
    const link = document.createElement('a');
    link.href = `${import.meta.env.BASE_URL}${character.notice}`;
    link.textContent = '角色來源'; link.target = '_blank'; link.rel = 'noopener'; foot.append(link);
  }
  selected(initial);
  panel.querySelectorAll<HTMLButtonElement>('[data-character]').forEach(button => button.addEventListener('click', async () => {
    const character = characters.find(c => c.id === button.dataset.character)!;
    const current = ++request;
    message.textContent = `載入 ${character.name}…`;
    panel.setAttribute('aria-busy', 'true');
    const success = await callbacks.select(character);
    if (current !== request) return;
    panel.setAttribute('aria-busy', 'false');
    if (success) { selected(character); message.textContent = '人物已切換'; }
    else message.textContent = '載入失敗，已保留目前人物；可重新選取重試。';
  }));
  panel.querySelector<HTMLInputElement>('#showcase')!.addEventListener('change', event => {
    const enabled = (event.target as HTMLInputElement).checked;
    (panel.querySelector('.motion-controls') as HTMLElement).hidden = !enabled;
    callbacks.showcase(enabled);
  });
  panel.querySelectorAll<HTMLButtonElement>('[data-motion]').forEach(button => button.addEventListener('click', () => {
    panel.querySelectorAll('[data-motion]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    callbacks.motion(button.dataset.motion as HeroMotion);
  }));
  panel.querySelectorAll<HTMLButtonElement>('[data-view]').forEach(button => button.addEventListener('click', () => callbacks.view(button.dataset.view === 'close')));
}
