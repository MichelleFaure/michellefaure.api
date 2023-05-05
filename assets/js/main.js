
const input = document.querySelector(".input");
const moneda = document.querySelector("#moneda");
const btn = document.querySelector(".btn-buscar");
const resultadoTotal = document.querySelector(".resultado");

async function getdata() {
  try {
    const res = await fetch("https://mindicador.cl/api/")
    const data = await res.json() 
    return data
  } catch(e){
    alert(e.message)
  }
}


btn.addEventListener("click", calcularvalor)

async function calcularvalor(){
  try {
    const indicadores = await getdata()
    const tipoMoneda = moneda.value;
    const valor = indicadores[tipoMoneda].valor
    const valorIngresado = Number(input.value);
  
    const resultado = valorIngresado/valor

    resultadoTotal.innerHTML = resultado.toFixed(2)

    getdataporfecha(tipoMoneda)
  } catch(e){
    alert(e.message)
  }
}

// ---------------------------------------------------------------

async function getdataporfecha(tipoMoneda) {

  try {
    const fechaActual = new Date();
    const anoActual =  fechaActual.getFullYear();
    const mesActual = fechaActual.getMonth();
    const diaActual = fechaActual.getDate();
    
    const fecha = [];
    const precio = [];
    for (let i = 0 ; i<=10 ; i++){
        const diezdias = diaActual-i
        const fechapasada = new Date(anoActual, mesActual, diezdias );
        const anomodificado = fechapasada.getFullYear();
        const mesmodificado = fechapasada.getMonth();
        const diamodificado = fechapasada.getDate();
        const link = `https://mindicador.cl/api/${tipoMoneda}/${diamodificado}-${mesmodificado+1}-${anomodificado}` 
  
        const res = await fetch(link)
        const data = await res.json() 
        
        if((data["serie"][0])){
          fecha.push(data["serie"][0].fecha)
          precio.push(data["serie"][0].valor)
        }
        
    }
  
    generargrafico(fecha, precio)
    
  } catch(e){
    alert(e.message)
  }

}


let myChart = null;

function generargrafico(fecha,precio){
  const ctx = document.getElementById('myChart');

  if(myChart!=null){
    myChart.destroy();
  }

  myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: fecha,
        datasets: [{
          label: 'historial ultimos 10 dias',
          data: precio,
          borderWidth: 1,
          
        }]
      },
      options: {
        scales: {
          y: {
            
          }
        }
      }
    });
}

