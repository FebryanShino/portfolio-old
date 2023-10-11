const redirectElement = document.querySelector('.redirect');
const popupElement = document.querySelector('.popup');
const closePopup = () => {
  redirectElement.style.setProperty('--rotate', '0deg');
  popupElement.classList.add('hidden');
  popupElement.dataset.status = 'false';
}


redirectElement.addEventListener('click', (e) => {
  e.preventDefault();
  
  let status = popupElement.dataset.status === 'false';
  if (status) {
    redirectElement.style.setProperty('--rotate', '45deg');
    popupElement.classList.remove('hidden');
    popupElement.dataset.status = status;
  } else {
    closePopup();
  }
});


const popupButtons = document.querySelectorAll('.popup a');

popupButtons[0].addEventListener('click', (e) => {
  e.preventDefault();
  closePopup();
  navigator.clipboard.writeText(document.location.href);
});

popupButtons[1].addEventListener('click', (e) => {
  e.preventDefault();
  closePopup();
  alert('No QR Code Yet')
});





let works = [];

const loadProfile = async () => {
  let res = await fetch('profile.json');
  let data = await res.json();

  const name = document.querySelector('nav > div > .title');
  const bioShort = document.querySelector('.intro > p');

  const bio = document.querySelectorAll('.profile > .pf > p > span')

  let bioText = data.bio.split('\n');
  name.textContent = data.username;
  bioShort.innerHTML = bioText.slice(0,3).join('<br/>');
  
  bio[0].innerHTML = bioText.join('<br/>');
  bio[1].textContent = `Email: ${data.email}`;
  bio[2].innerHTML = `Equipments:<br/>〜 ${data.equipment.join('<br/>〜 ')}`;


  const links = document.querySelector('.profile > .lf');

  for(let i = 0; i < data.links.length; i++) {
    let item = document.createElement('a');
    item.textContent = data.links[i][0];
    item.href = data.links[i][1];
    item.target = '_blank';

    links.appendChild(item);
  }
}

loadProfile();




const profile = document.querySelector('.profile');
const closeProfile = document.querySelector('.profile > .close-profile');
const moreOption = document.querySelector('.intro > .links > a:last-child');

closeProfile.addEventListener('click', (e) => {
  e.preventDefault();
  profile.classList.add('hidden');
  document.body.classList.remove('no-scroll');
});

moreOption.addEventListener('click', (e) => {
  e.preventDefault();
  profile.classList.remove('hidden');
  document.body.classList.add('no-scroll');
});






const loadDatabase = async (type) => {
  let res = await fetch(`data/${type}.csv`);
  let data = (await res.text()).split('\n');
  if (data.slice(1) == '') {
    return [];
  }
  return data.slice(1);
}


const loadWorks = async (type) => {
  if(works == '') {
    const illustration = await loadDatabase('illustration');
    const render = await loadDatabase('render');
    const photoshop = await loadDatabase('photoshop');
    const CSSAnimation = await loadDatabase('css_animation');
    const website = await loadDatabase('website');
    const all = illustration.concat(render, photoshop, CSSAnimation, website);
    
    works = [all,illustration,render,photoshop,CSSAnimation,website];
    document.querySelector('.loading').style.display = 'none';
  }

  
  
  const container = document.querySelector('.contents > .items');
  const banner = document.querySelector('.contents > .banner');
  const noWorkMessage = document.querySelector('.contents > .no-work');
  
  container.innerHTML = '';
  if(works[type].length === 0) {
    return;
  }
  
  
  banner.style.background = `url(${works[type][0].split(', ')[1]})`;
  banner.style.backgroundSize = 'cover';
  banner.style.backgroundPosition = 'center 0';

  
  for(let i = 0; i < works[type].length; i++) {
    let work = works[type][i].split(', ');
    let item = document.createElement('div');
    let thumbnail = document.createElement('a');
    let title = document.createElement('h4');
    title.textContent = work[0];

    thumbnail.href = '#';
    thumbnail.style.background = `url(${work[1]})`;
    thumbnail.style.backgroundSize = 'cover';
    thumbnail.style.backgroundPosition = 'center 0';
    
    thumbnail.addEventListener('click', (e) => {
      e.preventDefault();
      openPreview(work[0], work[3], work[2], work[1]);
    });
    
    item.appendChild(thumbnail);
    item.appendChild(title);
    container.appendChild(item);
  }
}

loadWorks(0);





window.addEventListener('scroll', () => {
  let value = window.scrollY;
  const nav = document.querySelector('nav > div');
  const redirect = document.querySelector('.redirect');
  const title = document.querySelector('.title');
  const logo = document.querySelector('.logo');
  
  if(value > 16*18) {
    nav.style.border = '.05rem solid var(--color-3)';
    nav.style.backdropFilter = 'blur(10px)';
    nav.style.background = 'rgba(255,255,255,.25)';
    title.style.color = 'var(--color-3)';
    
    logo.classList.remove('hidden');
    
    redirect.style.transform = 'scale(.7)';
    redirect.style.border = '.05rem solid var(--color-3)';
    redirect.style.setProperty('--line', 'var(--color-3)');
    
    
  } else {
    nav.style.border = '.05rem solid transparent';
    nav.style.backdropFilter = 'none';
    nav.style.background = 'transparent';
    title.style.color = 'var(--color-2)';
    logo.classList.add('hidden');
    
    redirect.style.transform = 'scale(1)';
    redirect.style.border = '.05rem solid var(--color-2)';
    redirect.style.setProperty('--line', 'var(--color-2)');
    
  }
  if (value > 16*12 && value <= 16*18){
    title.style.opacity = 0;
  } else {
    title.style.opacity = 1;
  }
});







const categories = document.querySelectorAll('.category > a');


for(let i = 0; i < categories.length; i++) {
  let button = categories[i];

  button.addEventListener('click', (e) => {
    e.preventDefault();
    loadWorks(i);
    button.classList.add('active');
    for(let j = 0; j < categories.length; j++) {
      if(categories[j] !== button) {
        categories[j].classList.remove('active');
      }
    }
  });
}



const previewPage = document.querySelector('.preview');


const closePreview = document.querySelector('.preview > .nav > a');


closePreview.addEventListener('click', (e) => {
  e.preventDefault();
  previewPage.classList.add('hidden');
  document.body.classList.remove('no-scroll');
});


const openPreview = (text, desc, link, img) => {
  previewPage.classList.remove('hidden');
  document.body.classList.add('no-scroll');

  const title = document.querySelector('.preview > .header > h3');
  const picture = document.querySelector('.preview > .picture > img');
  const description = document.querySelector('.preview > .description > p')
  const visit = document.querySelector('.preview > .header > div > #visit');

  desc = desc.replace(/\\n/g, '<br/>');

  description.innerHTML = desc;
  title.innerHTML = text;
  picture.src = img;
  visit.href = link;

  loadOtherWorks();
}



const loadOtherWorks = () => {
  const otherWorks = document.querySelector('.preview > .other-work > div');
  
  otherWorks.innerHTML = '';
  
  for(let i = 0; i < 5; i++) {
    let randomIndex = Math.floor(Math.random() * (works[0].length));

    let work = works[0][randomIndex].split(', ');

    let item = document.createElement('a');
    let thumbnail = document.createElement('div');
    let title = document.createElement('h4');

    item.href = '#';

    item.addEventListener('click', (e) => {
      previewPage.scroll({
        top: 0,
        behavior: 'auto'
      });
      openPreview(work[0], work[3], work[2], work[1]);
    });
    thumbnail.style.background = `url(${work[1]})`;
    thumbnail.style.backgroundSize = 'cover';
    thumbnail.style.backgroundPosition = 'center 0';
    title.textContent = work[0];
    
    item.appendChild(thumbnail);
    item.appendChild(title);
    otherWorks.appendChild(item);
  }
}
