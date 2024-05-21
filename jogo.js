console.log('[LiviaVasc] Flappy Bird');

let frames = 0;
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
            planoDeFundo.spriteX, planoDeFundo.SpriteY, // Sprite X, Sprite Y
            planoDeFundo.largura, planoDeFundo.altura, // Tamanho do recorte na sprite
            planoDeFundo.x, planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
        );
        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.SpriteY, // Sprite X, Sprite Y
            planoDeFundo.largura, planoDeFundo.altura, // Tamanho do recorte na sprite
            (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
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
                chao.spriteX, chao.SpriteY, // Sprite X, Sprite Y
                chao.largura, chao.altura, // Tamanho do recorte na sprite
                chao.x, chao.y,
                chao.largura, chao.altura,
            );
            contexto.drawImage(
                sprites,
                chao.spriteX, chao.SpriteY, // Sprite X, Sprite Y
                chao.largura, chao.altura, // Tamanho do recorte na sprite
                (chao.x + chao.largura), chao.y,
                chao.largura, chao.altura,
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
            console.log("antes:", flappyBird.velocidade);
            flappyBird.velocidade = -flappyBird.pulo;
            console.log("Depois:", flappyBird.velocidade);
        }, 
        gravidade: 0.25,
        velocidade: 0,
        atualiza(){
            if(fazColisao(flappyBird, globais.chao)){
                console.log('Fez colisão');
                som_HIT.play();

                mudaParaTela(Telas.GameOver);
                return;
            }
    
            flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
            flappyBird.y = flappyBird.y + flappyBird.velocidade;
        },
        movimentos: [
            {spriteX: 0, SpriteY: 0}, //asa para cima
            {spriteX: 0, SpriteY: 26}, //asa no meio
            {spriteX: 0, SpriteY: 52}, //asa para baixo
            {spriteX: 0, SpriteY: 26} //asa no meio
        ],
        frameAtual: 0,
        atualizaOFrameAtual() {
            const inetrvaloDeFrames = 10;
            const passouDoIntervalo = frames % inetrvaloDeFrames === 0;
            //console.log(passouDoIntervalo)

            if(passouDoIntervalo) {
            const baseDoIncremento = 1;
            const incremento = baseDoIncremento + flappyBird.frameAtual;
            const baseRepeticao = flappyBird.movimentos.length;
            flappyBird.frameAtual = incremento % baseRepeticao;
            }
        },
        desenha(){
            flappyBird.atualizaOFrameAtual();
            const {spriteX, SpriteY} = flappyBird.movimentos[flappyBird.frameAtual];

            contexto.drawImage(
                sprites,
                spriteX, SpriteY, // Sprite X, Sprite Y
                flappyBird.largura, flappyBird.altura, // Tamanho do recorte na sprite
                flappyBird.x, flappyBird.y,
                flappyBird.largura, flappyBird.altura,
            );
        }
    }
    return flappyBird;
}

function criaCanos() {
    const canos = {
        largura: 52,
        altura: 400,
        chao: {
            spriteX: 0,
            SpriteY: 169
        },
        ceu: {
            spriteX: 52,
            SpriteY: 169
        },
        espaco: 80,
        desenha(){
            canos.pares.forEach(function(par) {
            const yRandom = par.y;
            const espacamentosEntreCanos = 90;

            const canosCeuX = par.x;
            const canosCeuY = yRandom;
            //Cano do céu
            contexto.drawImage(
                sprites,
                canos.ceu.spriteX, canos.ceu.SpriteY,
                canos.largura, canos.altura,
                canosCeuX, canosCeuY,
                canos.largura, canos.altura, 
            );

            const canosChaoX = par.x; 
            const CanosChaoY = canos.altura + espacamentosEntreCanos + yRandom;
            //Canos do chão
            contexto.drawImage(
                sprites,
                canos.chao.spriteX, canos.chao.SpriteY,
                canos.largura, canos.altura,
                canosChaoX, CanosChaoY,
                canos.largura, canos.altura, 
            );

            par.canosCeu = {
                x: canosCeuX,
                y: canos.altura + canosCeuY
            }
            par.canosChao = {
                x: canosChaoX,
                y: CanosChaoY
            }


            })
        },

        temColisaoComOFlappyBird(par){
            const cabecaDoFlappy = globais.flappyBird.y;
            const peDoFlappy = globais.flappyBird.y + globais.flappyBird.altura;
            
            if((globais.flappyBird.x + globais.flappyBird.largura)>= par.x){
                //console.log('Flappy bird invadiu a área dos canos');
                    if(cabecaDoFlappy <= par.canosCeu.y){
                        return true;
                    }

                    if(peDoFlappy >= par.canosChao.y){
                        return true;
                    }
            }
            return false;
        },
        pares: [],
        atualiza(){
            const passou100Frames = frames % 100 === 0;
            if(passou100Frames) {
                console.log('Passou 100 frames')
                canos.pares.push({
                    x: canvas.width,
                    y: -150 * (Math.random() + 1)
                });
            }

            canos.pares.forEach(function(par) {
                par.x = par.x - 2;

                if(canos.temColisaoComOFlappyBird(par)) {
                    //console.log('você perdeu')
                    som_HIT.play();
                    mudaParaTela(Telas.GameOver);
                }

                if (par.x + canos.largura <= 0) {
                    canos.pares.shift();
                }
            })


        }
    }
    return canos;
}

function criaPlacar(){
    const placar ={
        pontuacao: 0,
        desenha(){
            contexto.font = '35px "VT323"';
            contexto.textAlign = 'right'
            contexto.fillStyle = "white"
            contexto.fillText(`${placar.pontuacao}`, canvas.width - 10, 35);
            placar.pontuacao
        },
        atualiza(){
            const inetrvaloDeFrames = 20;
            const passouDoIntervalo = frames % inetrvaloDeFrames === 0;

            if (passouDoIntervalo) {
                placar.pontuacao = placar.pontuacao + 1;
            }
        }


    }
    return placar
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
            mensagemGetReady.spriteX, mensagemGetReady.SpriteY, // Sprite X, Sprite Y
            mensagemGetReady.largura, mensagemGetReady.altura, // Tamanho do recorte na sprite
            mensagemGetReady.x, mensagemGetReady.y,
            mensagemGetReady.largura, mensagemGetReady.altura,
        );
    }
}

const mensagemGameOver = {
    spriteX: 134,
    SpriteY: 153,
    largura: 226,
    altura: 200,
    x: (canvas.width / 2) - 226 / 2,
    y: 50, 
    desenha(){
        contexto.drawImage(
            sprites,
            mensagemGameOver.spriteX, mensagemGameOver.SpriteY, // Sprite X, Sprite Y
            mensagemGameOver.largura, mensagemGameOver.altura, // Tamanho do recorte na sprite
            mensagemGameOver.x, mensagemGameOver.y,
            mensagemGameOver.largura, mensagemGameOver.altura,
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
            globais.canos = criaCanos();
        },
        desenha(){
            planoDeFundo.desenha();
            
            globais.flappyBird.desenha();
            globais.chao.desenha();
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

Telas.GameOver = {
    desenha(){
        mensagemGameOver.desenha();
    },
    atualiza(){

    },
    click(){
        mudaParaTela(Telas.INICIO);
    }
}

Telas.JOGO = {
    inicializa(){
    globais.placar = criaPlacar();
    },
    desenha(){
        planoDeFundo.desenha();
        globais.canos.desenha();
        globais.chao.desenha();
        globais.flappyBird.desenha();
        globais.placar.desenha();
    },
    click(){
        globais.flappyBird.pula();
    },
    atualiza(){
        globais.canos.atualiza();
        globais.chao.atualiza();
        globais.flappyBird.atualiza();
        globais.placar.atualiza();
    }
}

function loop(){
    telaAtiva.desenha();
    telaAtiva.atualiza();

    frames = frames + 1;
    requestAnimationFrame(loop);
}

window.addEventListener('click', function(){
    if(telaAtiva.click){
        telaAtiva.click();
    }
})

mudaParaTela(Telas.INICIO);
loop();
