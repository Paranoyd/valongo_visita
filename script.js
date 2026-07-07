function setActiveNavigation() {
  const navLinks = document.querySelectorAll('nav a');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach((link) => {
    const target = link.getAttribute('href');
    if (target === currentPath) {
      link.classList.add('active');
    }
  });
}

function initGalleryPage() {
  const galleryGrid = document.getElementById('galleryGrid');
  const imageInput = document.getElementById('imageUpload');
  const uploadButton = document.getElementById('uploadButton');
  const notice = document.getElementById('galleryNotice');
  let selectedFiles = [];

  const sampleImages = [
    'img/1.jpg',
    'img/2.jpg',
    'img/3.jpg',
    'img/4.jpg',
    'img/5.jpg',
    'img/6.jpg',
    'img/7.jpg',
    'img/8.jpg',
    'img/9.jpg',
    'img/10.jpg',
    'img/11.jpg',
    'img/12.jpg',
    'img/13.jpg',
    'img/14.jpg',
    'img/15.jpg'
  ];

  let galleryImages = [];

  function loadImages() {
    const stored = localStorage.getItem('studyTripGallery');
    if (stored) {
      try {
        galleryImages = JSON.parse(stored);
      } catch (error) {
        galleryImages = [...sampleImages];
      }
    } else {
      galleryImages = [...sampleImages];
    }
  }

  function saveImages() {
    localStorage.setItem('studyTripGallery', JSON.stringify(galleryImages));
  }

  function updateNotice() {
    notice.textContent = galleryImages.length === 0 ? 'Nenhuma imagem na galeria. Adicione fotos para começar.' : 'Pode carregar novas fotos sempre que desejar. Elas ficam guardadas no navegador.';
  }

  function renderGallery() {
    galleryGrid.innerHTML = '';
    galleryImages.forEach((src, index) => {
      const card = document.createElement('article');
      card.className = 'gallery-card';
      const image = document.createElement('img');
      image.src = src;
      image.alt = `Foto ${index + 1} da visita`;
      card.appendChild(image);
      galleryGrid.appendChild(card);
    });
    updateNotice();
  }

  function readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  function handleFilesSelected(event) {
    selectedFiles = Array.from(event.target.files || []).filter(file => file.type.startsWith('image/'));
    if (selectedFiles.length === 0) {
      notice.textContent = 'Nenhuma imagem válida selecionada. Escolha ficheiros do tipo imagem.';
      return;
    }
    notice.textContent = `Foram selecionadas ${selectedFiles.length} imagem(s). Clique em Enviar imagens para atualizar a galeria.`;
  }

  async function uploadSelectedFiles() {
    if (selectedFiles.length === 0) {
      notice.textContent = 'Selecione imagens antes de carregar.';
      return;
    }
    const readPromises = selectedFiles.map(readFile);
    const results = await Promise.all(readPromises);
    galleryImages = [...galleryImages, ...results];
    saveImages();
    renderGallery();
    selectedFiles = [];
    imageInput.value = '';
    notice.textContent = 'Imagens adicionadas com sucesso! A galeria foi atualizada.';
  }

  loadImages();
  renderGallery();
  imageInput.addEventListener('change', handleFilesSelected);
  uploadButton.addEventListener('click', uploadSelectedFiles);
}

window.addEventListener('DOMContentLoaded', () => {
  setActiveNavigation();
  if (document.body.classList.contains('galeria-page')) {
    initGalleryPage();
  }
});