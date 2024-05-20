console.log('[LiviaVasc] Flappy Bird');

const som_HIT = new Audio();
som_HIT.src = 'C:/Users/livia/OneDrive/Documentos/flappyBirdJogo/efeitos/hit.wav'

const sprites = new Image();
sprites.src = 'C:/Users/livia/OneDrive/Documentos/flappyBirdJogo/sprites.png';


const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

//
// Construção das telas
//

//background
const planoDeFundo = {
    spriteX: 390,
    SpriteY: 0,
    largura: 275,
    altura: 204,
    x: 0,
    y: canvas.height - 204, 
    desenha(){
        contexto.fillStyle = '#70c5ce';
        contexto.fillRect(0,0, canvas.width, canvas.height)


        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.SpriteY,//Sprite X, Sprite Y
            planoDeFundo.largura, planoDeFundo.altura,// Tamanho do recorte na sprite
            planoDeFundo.x, planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
            );
        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.SpriteY,//Sprite X, Sprite Y
            planoDeFundo.largura, planoDeFundo.altura,// Tamanho do recorte na sprite
            (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
            );
    }
}

//chão
const chao = {
    spriteX: 0,
    SpriteY: 611,
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height - 112, 
    desenha(){
        contexto.drawImage(
            sprites,
            chao.spriteX, chao.SpriteY,//Sprite X, Sprite Y
            chao.largura, chao.altura,// Tamanho do recorte na sprite
            chao.x, chao.y,
            chao.largura, chao.altura,
            );


        contexto.drawImage(
            sprites,
            chao.spriteX, chao.SpriteY,//Sprite X, Sprite Y
            chao.largura, chao.altura,// Tamanho do recorte na sprite
            (chao.x + chao.largura), chao.y,
            chao.largura, chao.altura,
            );
    }
}

function fazColisao(flappyBird, chao){
    const flappyBirdY = flappyBird.y + flappyBird.altura;
    const chaoY = chao.y;

    if(flappyBirdY >= chaoY){
        return true;
    }

    return false;
}


function criaFlappyBird() {
    const flappyBird = {
        spriteX: 0,
        SpriteY: 0,
        largura: 33,
        altura: 24,
        x: 10,
        y: 50,
        pulo: 4.6,
        pula(){
            console.log('Devo pular');
            console.log("antes:", flappyBird.velocidade)
            flappyBird.velocidade = -flappyBird.pulo;
            console.log("Depois:", flappyBird.velocidade)
        }, 
        gravidade: 0.25,
        velocidade: 0,
    
        atualiza(){
            if(fazColisao(flappyBird, chao)){
                console.log('Fez colisão');
                som_HIT.play();

                setTimeout(() => {
                    mudaParaTela(Telas.INICIO);
                }, 500)
                return
            }
    
            flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade 
            flappyBird.y = flappyBird.y + flappyBird.velocidade
        },
    
    
        desenha(){
            contexto.drawImage(
                sprites,
                flappyBird.spriteX, flappyBird.SpriteY,//Sprite X, Sprite Y
                flappyBird.largura, flappyBird.altura,// Tamanho do recorte na sprite
                flappyBird.x, flappyBird.y,
                flappyBird.largura, flappyBird.altura,
                );
        }
    }
    return flappyBird;
}



//Tela de início
const mensagemGetRead = {
    spriteX: 134,
    SpriteY: 0,
    largura: 174,
    altura: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50, 
    desenha(){
        contexto.drawImage(
            sprites,
            mensagemGetRead.spriteX, mensagemGetRead.SpriteY,//Sprite X, Sprite Y
            mensagemGetRead.largura, mensagemGetRead.altura,// Tamanho do recorte na sprite
            mensagemGetRead.x, mensagemGetRead.y,
            mensagemGetRead.largura, mensagemGetRead.altura,
            );


    }
}




//
// Movimentação de telas
//

const globais = {};
let telaAtiva = {};
function mudaParaTela(novaTela) {
    telaAtiva = novaTela

    if(telaAtiva.inicializa) {
        telaAtiva.inicializa();
    }
}


const Telas = {
    INICIO: {
        inicializa() {
            globais.flappyBird = criaFlappyBird();
        },
        desenha(){
        planoDeFundo.desenha();
        chao.desenha();
        globais.flappyBird.desenha();
        mensagemGetRead.desenha();


        },
        click(){
            mudaParaTela(Telas.JOGO);
        },
        atualiza(){


        }
    }


}


Telas.JOGO = {
    desenha(){
        planoDeFundo.desenha();
        chao.desenha();
        globais.flappyBird.desenha();
    },
    click(){
        globais.flappyBird.pula();
    },
    atualiza(){
        globais.flappyBird.atualiza();
    }
}


function loop(){


    telaAtiva.desenha();
    telaAtiva.atualiza();


    requestAnimationFrame(loop);
}


window.addEventListener('click', function(){
    if(telaAtiva.click){
        telaAtiva.click();
    }
})


mudaParaTela(Telas.INICIO);
loop();