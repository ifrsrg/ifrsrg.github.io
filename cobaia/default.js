function findFirstDate(data) {
  try {
    return new Date(/\d{4}-\d{2}-\d{2}/.exec(data)[0]+"T20:59:59.999");
  } catch (e) {
    return null;
  }
}

function findPontos(data) {
  try {
    return /\d{1,2}\.\d{1}/.exec(data)[0];
  } catch (e) {
    return null;
  }
}

function makeListItem(a, data) {
  var li = document.createElement('li');
  li.appendChild(a);
  li.title = data.split('\n')[0];
  return li;
}

function makeListGroupItem(a) {
  a.classList.add('list-group-item');
  return a;
}


function makeAnchor(tipo, data, n, prependTime) {

    var a = document.createElement('a');
    var badge = '';

    if (prependTime) {
      var dia = 1000 * 3600 * 24;
      var hoje = new Date();
      var prazo = findFirstDate(data);
      var pontos = findPontos(data);

      if (prazo) {
        var diasRestantes = Math.floor((prazo - hoje) / dia + 0.9);
        if (diasRestantes > 0) {
          a.classList.add('active');
          badge = "<span class='badge pull-right' style='background-color: "
            + (diasRestantes > 6 ? 'lime' :
               diasRestantes > 4 ? 'blue' :
               diasRestantes > 2 ? 'orange' : 'red')
            + " ;' title='resta(m) " + diasRestantes + " dia(s) para entregar'>" + diasRestantes  + "</span>";
        }
        a.title = "Prazo: " + prazo.toLocaleDateString();
      }

      if (pontos) {
        a.title = a.title + ", " + pontos + " pts";
      }

    }

    var enunciado = data.split('\n')[0];
    a.innerHTML = enunciado.substr(0,39) + (enunciado.length > 39 ? '...' : '') + badge;
    loc = window.location;
    a.href = loc + '../ver.html?' + loc.pathname.replace('/','') + 'atividade/' + tipo + '/' + n;

    return a;
}

function tryLoadAtividade(tipo, n) {
    $.ajax({url: 'atividade/' + tipo + '/' + n, success: function (data) {
        $('#atividade-' + tipo + '-menu').after(makeListItem(makeAnchor(tipo, data, n), data));
        $('#atividade-' + tipo + '-menu-vertical').append(makeListGroupItem(makeAnchor(tipo, data, n, true)));
        tryLoadAtividade(tipo, n+1);
    }, async: true});
}

function makeNota(data, n) {
    var li = document.createElement('li');
    var a = document.createElement('a');
    li.appendChild(a);

    li.title = data.split('\n')[0];

    var dia = findFirstDate(data);
    if (dia) {
      li.title = dia.toLocaleDateString() + ' ' + li.title;
    }

    a.innerHTML = data.split('\n')[0];

    var loc = window.location;
    a.href = window.location + '../nota.html?' + loc.pathname.replace('/','') + 'nota/' + n;
    return li;
}

function tryLoadNotas(n) {
    $.ajax({url:'nota/' + n, success: function (data) {
          $('#notas-de-aula').append(makeNota(data,n));
          tryLoadNotas(n+1);
    }, async: true});
}

$(function() {
    tryLoadAtividade('avaliada', 1);
    tryLoadAtividade('exercicio', 1);
    tryLoadAtividade('extra', 1);
    tryLoadNotas(1);
});