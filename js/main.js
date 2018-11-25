let lugaresInfo = []
var marcadorMarcado = 0;
var marcadorMArcadoenmapa=0;

const conseguirLugares = () => {
     // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDWbpQ8d77SXaPwoBxcZa5NnynrEcIJSZ0",
    authDomain: "colima-dangerous.firebaseapp.com",
    databaseURL: "https://colima-dangerous.firebaseio.com",
    projectId: "colima-dangerous",
    storageBucket: "colima-dangerous.appspot.com",
    messagingSenderId: "811188722184"
  };
  firebase.initializeApp(config);
  const db = firebase.database();
  const reftext = db.ref().child('datos');
  
  reftext.on('value', data => {
      data.forEach(datos => {
        let lugarInfo = {
            posicion: {lat:datos.val().latitud, lng:datos.val().longitud},
            descripcion: datos.val().descriction,
            nombre:datos.val().nombre_afectado,
            title: datos.val().title,
            tipo: datos.val().tipo
        }
        
        lugaresInfo.push(lugarInfo)
    
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(usuarioUbicacion => {
                var ubicacion = {
                    lat:usuarioUbicacion.coords.latitude,
                    lng:usuarioUbicacion.coords.longitude
                }
                dibujarMapa(ubicacion)
            })
        } else {
            alert('Para acceder al mapa nesecitas tener activada tu ubicacion')
        }
      });
    
  })
}

var marker;
var contenidoTarget;
var infowindow;
var circle;
var messagewindow;
var base='http://labs.google.com/ridefinder/images/';
var marcadorUbicacion = '../media/iconos/marker.png';
var marcadorHomicidios = '../media/iconos/crimescene.png'
var marcadorAccidentes = '../media/iconos/convertible.png'
var marcadorRobosA = '../media/iconos/shooting.png'
var marcadorRobosCa = '../media/iconos/house.png'
var marcadorOtros = 'http://maps.google.com/mapfiles/kml/pal3/icon41.png'

const dibujarMapa = (obj) => {
    let mapa = new google.maps.Map(document.getElementById('map'), {
        center: obj,
        zoom:13
    })
    let marcadorUsuario = new google.maps.Marker({
        position:obj,
        icon: base + marcadorUbicacion,
        title:'Tu ubicacion'
    })
    marcadorUsuario.setMap(mapa)
    
    var marcadores = lugaresInfo.map(lugar => {
        var mar;
        var danger = lugar.tipo
        var marca;
        if(danger == 'Homicidios dolosos') {
            marca = marcadorHomicidios
        } else if(danger == 'Accidentes automovilísticos') {
            marca = marcadorAccidentes  
        } else if(danger == 'Robo a casa habitación') {
            marca = marcadorRobosCa
        } else if(danger == 'Robo a mano armada') {
            marca = marcadorRobosA
        } else if(danger == 'Otro...'){
            marca = marcadorOtros
        }
        mar = new google.maps.Marker({
            position: lugar.posicion,
            title:lugar.title,
            info: lugar.title,
            icon: marca,
            map:mapa
        })
        mar.addListener('click', function(){
            contenidoTarget = '<p style="font-size:2em";font-weight:bold;">' + mar.title +'</p>' +
            '<p>' + lugar.descripcion +'</p>'
            infowindow.setContent(contenidoTarget)
            infowindow.open(mapa, mar)
        })
        infowindow = new google.maps.InfoWindow({
            content: lugar.title
        });
    })
    marker = new google.maps.Marker();
    google.maps.event.addListener(mapa, 'click', function(event) {
        marker.setMap(null)
        marker = new google.maps.Marker({
            position: event.latLng,
            map: mapa
        });
        marcadorMarcado = 1;
        
    });
}


function saveDatos() {
        const db = firebase.database();
        const reftext = db.ref().child('datos');
        var name = document.getElementById('Whats-name').value
        var caso = document.getElementById('What-happend').value
        var description = document.getElementById('description').value
        var plat = marker.position.lat();
        var plng = marker.position.lng();
        var tipo = document.getElementById('seleccion').value
        reftext.push({
            descriction: description,
            nombre_afectado: name,
            tipo: tipo,
            latitud: plat,
            longitud: plng,
            title: caso
        })
        marcadorMarcado = 0;
    
    
}

conseguirLugares()

//Validaciones del formulario

function validar() {
    if(marcadorMarcado == 0) {
        alert('Debes seleccionar una ubicación en el mapa.')
    }
    else if(marcadorMarcado == 1){

        if(document.getElementById('What-happend').value == 0 || document.getElementById('Whats-name').value == 0 || document.getElementById('description').value == 0) {
            alert('Necesitas llenar todos los datos')
        } 
        else{
            saveDatos()
            document.getElementById('What-happend').value = ''
            document.getElementById('Whats-name').value = ''
            document.getElementById('description').value = ''
            marker.clear()
        }
    }
}

function limpiar() {
    document.getElementById('What-happend').value = ''
    document.getElementById('Whats-name').value = ''
    document.getElementById('description').value = ''
    
}