document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('modal').style = 'display:none;';
    //Resgata os albuns na api e adiciona no html de forma dinamica
    fetch('https://images-assets.nasa.gov/recent.json')
        .then(response => response.json())
        .then(data => {
            const albums = shuffleArray(data.collection.items);
            
            const albumGallery = document.getElementById('album-gallery');

            albums.forEach((album, index) => {
                const albumTitle = album.data[0].title;
                const albumDate = new Date(album.data[0].date_created).toLocaleDateString('pt-BR');
                const albumId = `album-${index}`;

                const albumElement = document.createElement('div');
                albumElement.className = 'album';
                albumElement.onclick = () => AbrirModal(album.href);

                const titleElement = document.createElement('h2');
                titleElement.textContent = albumTitle;

                const dateElement = document.createElement('p');
                dateElement.textContent = albumDate;

                const imgElement = document.createElement('img');
                imgElement.src = album.links[0].href;

                albumElement.appendChild(titleElement);
                albumElement.appendChild(dateElement);
                albumElement.appendChild(imgElement);
                albumGallery.appendChild(albumElement);
            });
        })
        .catch(error => console.error('Erro ao buscar os dados:', error));
});
//Função responsavel por embaralhar e limitar o array a 16;
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.splice(0,16);
}

//Funções para abrir o album que foi selecionado para mostra as imagens
let fotos = [];
async function AbrirModal(urlAlbum) {
    await fetch(urlAlbum)
    .then(response => response.json())
    .then(data =>{
        fotos = data;
    })
    document.getElementById('modal').style = '';
    CarregarFotos()
}
function closeModal(){
    document.getElementById('modal').style = 'display:none;';
    indexImgSelecionada = 0;

}
function CarregarFotos(){
    //remove itens que não carrega nas tags de img ou video
    fotos = fotos.filter(item => !(/metadata\.json|srt|vtt/).test(item));

    document.getElementById('total-items').textContent = fotos.length;
    const selectPhoto = document.getElementById('select-photo');
    selectPhoto.innerHTML = '';
    fotos.forEach((foto,index) =>{
        index++
        const videoElement = document.createElement('video');
        const imgElement = document.createElement('img');
        if(foto.includes('mp4')){
            videoElement.id = index;
            videoElement.src = foto;
            videoElement.className = 'photo';
            videoElement.addEventListener('click', function(){
                document.getElementById(indexImgSelecionada).classList.remove('select');
                indexImgSelecionada = index;
                CarregarImagemSelecionado();
            })
            selectPhoto.appendChild(videoElement);
        }else{
            imgElement.id = index;
            imgElement.className = 'photo';
            imgElement.src = foto;
            imgElement.addEventListener('click', function(){
                document.getElementById(indexImgSelecionada).classList.remove('select');
                indexImgSelecionada = index;
                CarregarImagemSelecionado();
            })
            selectPhoto.appendChild(imgElement);
        }
    })
    changeSlide(true);
}
//Modifica o contador de imagem;
var indexImgSelecionada = 0;
function changeSlide(next){

    if(next){
        //não deixa passar o numero maior do que existe de fotos na galeria
        if(indexImgSelecionada < fotos.length){

            if(indexImgSelecionada != 0 )
                document.getElementById(indexImgSelecionada).classList.remove('select');
            
            indexImgSelecionada++;
        }
    }else{
        if(indexImgSelecionada > 1 && indexImgSelecionada <= fotos.length){
            document.getElementById(indexImgSelecionada).classList.remove('select');
            indexImgSelecionada--;
        }
    }
    CarregarImagemSelecionado();
}
//Carrega a imagem da galeria selecionada
function CarregarImagemSelecionado(){
    document.getElementById('modal-image').innerHTML = '';
    var fotoSelecionadoElement = document.getElementById(indexImgSelecionada);
    fotoSelecionadoElement.className += ' select';
    document.getElementById('current-index').textContent = indexImgSelecionada;
    const videoElement = document.createElement('video');
    const imgElement = document.createElement('img');
    if(fotoSelecionadoElement.tagName == 'IMG'){
        imgElement.src = fotoSelecionadoElement.src;
        imgElement.className = 'photo-select';
        document.getElementById('modal-image').appendChild(imgElement);
    }else{
        const source = document.createElement('source');
        source.src = fotoSelecionadoElement.src;
        source.type = 'video/mp4'
        videoElement.appendChild(source);
        videoElement.controls =true;
        videoElement.className = 'photo-select';
        document.getElementById('modal-image').appendChild(videoElement);
    }
}

document.getElementsByClassName('next')[0].addEventListener('click',function(){
    changeSlide(true);
    //faz os scrool horizontal percorrer conforme vai mudando a imagem;
    document.getElementById('select-photo-container').scrollBy({left:150,behavior:'smooth'})
})
document.getElementsByClassName('prev')[0].addEventListener('click',function(){
    changeSlide(false);
    document.getElementById('select-photo-container').scrollBy({left:-150,behavior:'smooth'})
})
