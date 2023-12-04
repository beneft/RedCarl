$(document).ready(function (){
    var bank = 0;
    var insur = 0;
    var wins = 0;
    var games = 0;
    var surr = false;
    var playerBJ = false;
    var dealerBJ = false;
    var peeking = false;
    $('#money').text(1000);
    $('#winrate').text('100%');
    let deck = [];
    let decks = [];
    initCards();
    //
    function Card(name,suit,value,subvalue){
        this.name = name;
        this.suit=suit;
        this.value=value;
        this.subvalue=subvalue;
    }
    function initCards(){
        deck.push(new Card('2d','diamonds',2));
        deck.push(new Card('2c','clubs',2));
        deck.push(new Card('2s','spades',2));
        deck.push(new Card('2h','hearts',2));
        deck.push(new Card('3d','diamonds',3));
        deck.push(new Card('3c','clubs',3));
        deck.push(new Card('3s','spades',3));
        deck.push(new Card('3h','hearts',3));
        deck.push(new Card('4d','diamonds',4));
        deck.push(new Card('4c','clubs',4));
        deck.push(new Card('4s','spades',4));
        deck.push(new Card('4h','hearts',4));
        deck.push(new Card('5d','diamonds',5));
        deck.push(new Card('5c','clubs',5));
        deck.push(new Card('5s','spades',5));
        deck.push(new Card('5h','hearts',5));
        deck.push(new Card('6d','diamonds',6));
        deck.push(new Card('6c','clubs',6));
        deck.push(new Card('6s','spades',6));
        deck.push(new Card('6h','hearts',6));
        deck.push(new Card('7d','diamonds',7));
        deck.push(new Card('7c','clubs',7));
        deck.push(new Card('7s','spades',7));
        deck.push(new Card('7h','hearts',7));
        deck.push(new Card('8d','diamonds',8));
        deck.push(new Card('8c','clubs',8));
        deck.push(new Card('8s','spades',8));
        deck.push(new Card('8h','hearts',8));
        deck.push(new Card('9d','diamonds',9));
        deck.push(new Card('9c','clubs',9));
        deck.push(new Card('9s','spades',9));
        deck.push(new Card('9h','hearts',9));
        deck.push(new Card('10d','diamonds',10));
        deck.push(new Card('10c','clubs',10));
        deck.push(new Card('10s','spades',10));
        deck.push(new Card('10h','hearts',10));
        deck.push(new Card('Jd','diamonds',10));
        deck.push(new Card('Jc','clubs',10));
        deck.push(new Card('Js','spades',10));
        deck.push(new Card('Jh','hearts',10));
        deck.push(new Card('Qd','diamonds',10));
        deck.push(new Card('Qc','clubs',10));
        deck.push(new Card('Qs','spades',10));
        deck.push(new Card('Qh','hearts',10));
        deck.push(new Card('Kd','diamonds',10));
        deck.push(new Card('Kc','clubs',10));
        deck.push(new Card('Ks','spades',10));
        deck.push(new Card('Kh','hearts',10));
        deck.push(new Card('Ad','diamonds',11,1));
        deck.push(new Card('Ac','clubs',11,1));
        deck.push(new Card('As','spades',11,1));
        deck.push(new Card('Ah','hearts',11,1));
    }
    function reshuffle(){
        decks = deck.map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
    }
    $('#mainbet').on('input propertychange',function(){
        if ($('#mainbet').val()>0){
            $('#start').prop('disabled',false);
        } else {
            $('#start').prop('disabled',true);
        }
    })
    $('#start').click(function(){
        $('#total').text(0);
        $('#dtotal').text(0);
        $('#player').empty();
        $('#dealer').empty();
        bank = $('#mainbet').val();
        surr=false;
        playerBJ=false;
        dealerBJ=false;
        peeking = false;
        $('#money').text($('#money').text()-bank);
        $('#surr').prop('disabled',false);
        $('#double').prop('disabled',false);
        $('#split').prop('disabled',true);
        $('#even').prop('disabled',true);
        $('#betbox').addClass('d-none');
        $('#controls').removeClass('d-none');
        reshuffle();
        flop();
    })
    function drawCard(target){
        let card = decks.pop();
        $('<img>',{height:100,width:70,src:'./img/decks/default/'+card.name+'.png',data:card}).appendTo(target);
    }
    function drawCard_hidden(){
        let card = decks.pop();
        $('<img>',{height:100,width:70,src:'./img/decks/default/back.png',data:card}).appendTo('#dealer');
    }
    function flop(){
        drawCard('#player');
        drawCard('#dealer');
        drawCard('#player');
        drawCard_hidden();
        if (detectUpperCard(11)) {
            $('#controls').addClass('d-none');
            $('#peekbox').removeClass('d-none');
            peeking = true;
        }
        sumTotal();
    }
    function sumTotal(){
        $('#total').text(0);
        $('#player').children().each(function(){
            $('#total').text(parseInt($('#total').text())+$(this).data().value);
        })
        if (checkAce()) {
            sumTotal();
        } else {
            if (parseInt($('#total').text()) > 21) {
                bank = 0;
                games++;
                $('#winrate').text(Math.floor(wins * 100 / games));
                $('#betbox').removeClass('d-none');
                $('#controls').addClass('d-none');
            }
            if (parseInt($('#total').text()) === 21 && !peeking) {
                if (detectBJ('#player','#total')) playerBJ=true;
                dealersTurn();
            }
            if (peeking){
                if (detectBJ('#player','#total')) playerBJ=true;
                if (playerBJ) $('#even').prop('disabled',false);
            }
        }
    }
    function checkAce(){
        let result = false;
        $('#player').children().each(function(){
            if ($(this).data().value===11&&parseInt($('#total').text())>21){
                let tmp = $(this).data().value;
                $(this).data().value = $(this).data().subvalue;
                $(this).data().subvalue = tmp;
                result = true;
            }
        })
        $('#dealer').children().each(function(){
            if ($(this).data().value===11&&parseInt($('#dtotal').text())>21){
                let tmp = $(this).data().value;
                $(this).data().value = $(this).data().subvalue;
                $(this).data().subvalue = tmp;
                result = true;
            }
        })
        return result;
    }
    function detectBJ(target,targettotal){
        let result = false;
        if (parseInt($(targettotal).text())===21&&$(target).children().length===2){
            result = true;
        }
        return result;
    }
    function detectUpperCard(value){
        let result = false;
        if ($('#dealer').children().first().data().value===value){
            result = true;
        }
        return result;
    }
    $('#hit').click(function (){
        $('#surr').prop('disabled',true);
        $('#double').prop('disabled',true);
        $('#split').prop('disabled',true);
        drawCard('#player');
        sumTotal();
    })
    $('#stand').click(function (){
        dealersTurn();
    })
    $('#double').click(function(){
        $('#money').text($('#money').text()-bank);
        bank *=2;
        drawCard('#player');
        sumTotal();
        dealersTurn();
    })
    $('#split').click(function(){

    })
    $('#insurance').click(function(){
        insur = bank/2;
        if (peek()){
            $('#dealer').children().last().attr('src','./img/decks/default/'+$('#dealer').children().last().data().name+'.png');
            $('#money').text(parseInt($('#money').text()) + insur*3);
            insur = 0;
            bank = 0;
            games++;
            dealersTotal();
            $('#winrate').text(Math.floor(wins*100/games));
            $('#betbox').removeClass('d-none');
            $('#peekbox').addClass('d-none');
        } else {
            bank = 0;
            insur = 0;
            $('#money').text(parseInt($('#money').text()) - insur);
            $('#peekbox').addClass('d-none');
            $('#controls').removeClass('d-none');
            $('#surr').prop('disabled',true);
        }
    })
    $('#even').click(function(){

    })
    $('#continue').click(function(){
        if (peek()){
            $('#dealer').children().last().attr('src','./img/decks/default/'+$('#dealer').children().last().data().name+'.png');
            bank = 0;
            games++;
            dealersTotal();
            $('#winrate').text(Math.floor(wins*100/games));
            $('#betbox').removeClass('d-none');
            $('#peekbox').addClass('d-none');
        } else {
            $('#peekbox').addClass('d-none');
            $('#controls').removeClass('d-none');
            $('#surr').prop('disabled',true);
        }
    })
    $('#surr').click(function(){
        surr = true;
        $('#money').text(parseInt($('#money').text())+Math.floor(bank/2));
        bank = Math.ceil(bank/2);
        dealersTurn();
    })
    function peek(){
        let result = false;
        let sum = 0;
        $('#dealer').children().each(function(){
            sum += $(this).data().value;
        })
        if (sum===21){
            result = true;
        }
        return result;
    }
    function dealersTurn(){
        let sum = 0;
        $('#dealer').children().each(function(){
          if ($(this).attr('src')==='./img/decks/default/back.png') {
              $(this).attr('src','./img/decks/default/'+$(this).data().name+'.png');
          }
          sum += $(this).data().value;
        })
        dealersTotal();
        if (checkAce()) {
            sum = 0;
            $('#dealer').children().each(function(){
                sum+=$(this).data().value;
            })
        }
        while (sum<17){
            drawCard('#dealer');
            dealersTotal();
            if (checkAce()) {
                sum = 0;
                $('#dealer').children().each(function(){
                    sum+=$(this).data().value;
                }
            )} else sum+=$('#dealer').children().last().data().value;
        }
        dealersTotal();
        if (detectBJ('#dealer','#dtotal')) dealerBJ = true;
        games++;
        const dealerres = parseInt($('#dtotal').text());
        const playerres = parseInt($('#total').text());
        if (!surr) {
            //player lose
            if ((dealerres > playerres && dealerres <= 21) || playerres > 21||(dealerBJ&&!playerBJ)) {
                bank = 0;
            }
            //tie
            if (((dealerres === playerres &&(!dealerBJ&&!playerBJ))||(dealerBJ&&playerBJ)) && playerres <= 21 && dealerres <= 21) {
                $('#money').text(parseInt($('#money').text()) + parseInt(bank));
                bank = 0;
                games--;
            }
            //player win
            if ((dealerres < playerres || dealerres > 21||(playerBJ&&!dealerBJ)) && playerres <= 21) {
                bank = parseInt(bank);
                if (playerBJ) bank+=Math.floor(bank*1.5);
                else bank*=2;
                $('#money').text(parseInt($('#money').text()) + bank);
                bank = 0;
                wins++;
            }
        }
        $('#winrate').text(Math.floor(wins*100/games));
        $('#betbox').removeClass('d-none');
        $('#controls').addClass('d-none');
    }
    function dealersTotal(){
        $('#dtotal').text(0);
        $('#dealer').children().each(function(){
            $('#dtotal').text(parseInt($('#dtotal').text())+$(this).data().value);
        })
    }
})