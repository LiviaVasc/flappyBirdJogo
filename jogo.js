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
        contexto.fillRect(0,0, canvas.width, canvas.height);

        contexto.drawImage(
            sprites,
            this.spriteX, this.SpriteY, // Sprite X, Sprite Y
            this.largura, this.altura, // Tamanho do recorte na sprite
            this.x, this.y,
            this.largura, this.altura,
        );
        contexto.drawImage(
            sprites,
            this.spriteX, this.SpriteY, // Sprite X, Sprite Y
            this.largura, this.altura, // Tamanho do recorte na sprite
            (this.x + this.largura), this.y,
            this.largura, this.altura,
        );
    }
}

//chão
function criaChao() {
    const chao = {
        spriteX: 0,
        SpriteY: 611,
        largura: 224,
        altura: 112,
        x: 0,
        y: canvas.height - 112, 
        atualiza () {
            //Criando a movimentação infinita do chão
            const movoimentoDoChao = 1;
            const repeteEm = chao.largura / 2;
            const movimentacao = chao.x - movoimentoDoChao;

            //console.log("[Chão.x]", chao.x );
            //console.log("[RepeteEm]", repeteEm);
            //console.log("[movimentacao]", movimentacao % repeteEm )

            chao.x = movimentacao % repeteEm;
        },
        desenha(){
            contexto.drawImage(
                sprites,
                this.spriteX, this.SpriteY, // Sprite X, Sprite Y
                this.largura, this.altura, // Tamanho do recorte na sprite
                this.x, this.y,
                this.largura, this.altura,
            );
            contexto.drawImage(
                sprites,
                this.spriteX, this.SpriteY, // Sprite X, Sprite Y
                this.largura, this.altura, // Tamanho do recorte na sprite
                (this.x + this.largura), this.y,
                this.largura, this.altura,
            );
        }
    }
    return chao;
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
            console.log("antes:", this.velocidade);
            this.velocidade = -this.pulo;
            console.log("Depois:", this.velocidade);
        }, 
        gravidade: 0.25,
        velocidade: 0,
        atualiza(){
            if(fazColisao(this, globais.chao)){
                console.log('Fez colisão');
                som_HIT.play();

                setTimeout(() => {
                    mudaParaTela(Telas.INICIO);
                }, 500);
                return;
            }
    
            this.velocidade += this.gravidade;
            this.y += this.velocidade;
        },
        desenha(){
            contexto.drawImage(
                sprites,
                this.spriteX, this.SpriteY, // Sprite X, Sprite Y
                this.largura, this.altura, // Tamanho do recorte na sprite
                this.x, this.y,
                this.largura, this.altura,
            );
        }
    }
    return flappyBird;
}

//Tela de início
const mensagemGetReady = {
    spriteX: 134,
    SpriteY: 0,
    largura: 174,
    altura: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50, 
    desenha(){
        contexto.drawImage(
            sprites,
            this.spriteX, this.SpriteY, // Sprite X, Sprite Y
            this.largura, this.altura, // Tamanho do recorte na sprite
            this.x, this.y,
            this.largura, this.altura,
        );
    }
}

// Movimentação de telas
const globais = {};
let telaAtiva = {};
function mudaParaTela(novaTela) {
    telaAtiva = novaTela;

    if(telaAtiva.inicializa) {
        telaAtiva.inicializa();
    }
}

const Telas = {
    INICIO: {
        inicializa() {
            globais.flappyBird = criaFlappyBird();
            globais.chao = criaChao();
        },
        desenha(){
            planoDeFundo.desenha();
            globais.chao.desenha();
            globais.flappyBird.desenha();
            mensagemGetReady.desenha();
        },
        click(){
            mudaParaTela(Telas.JOGO);
        },
        atualiza(){
            globais.chao.atualiza();
        }
    }
};

Telas.JOGO = {
    desenha(){
        planoDeFundo.desenha();
        globais.chao.desenha();
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
