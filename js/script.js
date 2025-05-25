let variableCount = 2;
let restriccionCount = 0;
let metodoActual = 'grafico';
let optimizacionActual = 'max';
let modeloResuelto = null;
let programacionEntera = false;
let mostrarSombra = false;
let tabActual = 0;

// Configuración básica
function toggleEntera() {
  programacionEntera = !programacionEntera;
  const btn = document.getElementById('btnEntera');
  if (programacionEntera) {
    btn.textContent = 'Activa';
    btn.className = 'btn btn-success btn-toggle';
  } else {
    btn.textContent = 'Inactiva';
    btn.className = 'btn btn-outline-success btn-toggle';
  }
}

function limpiarModelo() {
  if (confirm('¿Está seguro de que desea limpiar todo el modelo?')) {
    variableCount = 2;
    restriccionCount = 0;
    modeloResuelto = null;
    programacionEntera = false;
    
    // Reiniciar UI
    document.getElementById('btnEntera').textContent = 'Inactiva';
    document.getElementById('btnEntera').className = 'btn btn-outline-success btn-toggle';
    
    // Limpiar campos
    renderObjetivo();
    renderRestricciones();
    actualizarNombresRestricciones();
    
    // Volver al primer tab
    tabActual = 0;
    activarTab('config');
  }
}

function setMetodo(metodo) {
  metodoActual = metodo;
  const btnGrafico = document.getElementById('btnGrafico');
  const btnSimplex = document.getElementById('btnSimplex');
  
  if (metodo === 'grafico') {
    btnGrafico.className = 'btn active-method';
    btnSimplex.className = 'btn inactive-method';
  } else {
    btnGrafico.className = 'btn inactive-method';
    btnSimplex.className = 'btn active-method';
  }
}

function setOptimizacion(tipo) {
  optimizacionActual = tipo;
  const btnMax = document.getElementById('btnMaximizar');
  const btnMin = document.getElementById('btnMinimizar');
  
  if (tipo === 'max') {
    btnMax.className = 'btn active-method';
    btnMin.className = 'btn inactive-method';
  } else {
    btnMax.className = 'btn inactive-method';
    btnMin.className = 'btn active-method';
  }
  renderObjetivo();
}

// Variables
function agregarVariable() {
  if (variableCount < 6) {
    variableCount++;
    renderObjetivo();
    renderRestricciones();
    actualizarNombresVariables();
  }
}

function eliminarVariable() {
  if (variableCount > 2) {
    variableCount--;
    renderObjetivo();
    renderRestricciones();
    actualizarNombresVariables();
  }
}

function actualizarNombresVariables() {
  const container = document.getElementById('variablesNombres');
  const nombresActuales = {};
  
  // Guardar nombres existentes
  for (let i = 0; i < 6; i++) {
    const input = document.getElementById(`nombre_x${i}`);
    if (input) {
      nombresActuales[i] = input.value;
    }
  }
  
  container.innerHTML = '';
  
  for (let i = 0; i < variableCount; i++) {
    const nombreActual = nombresActuales[i] || '';
    container.innerHTML += `
      <div class="row mb-2 align-items-center">
        <div class="col-3">
          <span class="badge bg-primary">X${i}</span>
        </div>
        <div class="col-9">
          <input type="text" class="form-control form-control-sm" 
                 placeholder="Descripcion de la variable" 
                 id="nombre_x${i}" value="${nombreActual}">
        </div>
      </div>
    `;
  }
}

// Función objetivo
function renderObjetivo() {
  const cont = document.getElementById("objetivoContainer");
  cont.innerHTML = '';
  
  for (let i = 0; i < variableCount; i++) {
    cont.innerHTML += `
      <div class="col-auto">
        <input type="number" class="form-control variable-input" placeholder="1" name="c_X${i}" step="0.1">
      </div>
      <div class="col-auto">
        <span class="form-text fw-bold">X${i}</span>
      </div>
      ${i < variableCount - 1 ? '<div class="col-auto"><span class="form-text">+</span></div>' : ''}
    `;
  }
  cont.innerHTML += `<div class="col-auto"><span class="form-text fw-bold text-primary">→ ${optimizacionActual.toUpperCase()}</span></div>`;
}

// Restricciones
function crearFilaRestriccion(id) {
  let fila = `<div class="restriction-row" id="rest-${id}">
    <div class="row g-2 align-items-center">
      <div class="col-auto"><strong class="text-primary">R${id}:</strong></div>`;
  
  for (let i = 0; i < variableCount; i++) {
    fila += `
      <div class="col-auto">
        <input type="number" class="form-control variable-input" name="r${id}_x${i}" placeholder="1" value="1" step="0.1">
      </div>
      <div class="col-auto">
        <span class="form-text">X${i}</span>
      </div>
      ${i < variableCount - 1 ? '<div class="col-auto"><span class="form-text">+</span></div>' : ''}
    `;
  }
  
  fila += `
      <div class="col-auto">
        <select class="form-select form-select-sm" name="r${id}_op" style="width: 70px;">
          <option value="<=">&le;</option>
          <option value="=" selected>=</option>
          <option value=">=">&ge;</option>
        </select>
      </div>
      <div class="col-auto">
        <input type="number" class="form-control variable-input" name="r${id}_rhs" placeholder="1" value="1" step="0.1">
      </div>
      <div class="col-auto">
        <button class="btn btn-sm btn-outline-danger" onclick="eliminarRestriccion(${id})">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </div>
  </div>`;
  return fila;
}

function renderRestricciones() {
  const cont = document.getElementById("restriccionesContainer");
  cont.innerHTML = '';
  for (let i = 0; i < restriccionCount; i++) {
    cont.innerHTML += crearFilaRestriccion(i);
  }
}

function actualizarNombresRestricciones() {
  const container = document.getElementById('restriccionesNombres');
  const nombresActuales = {};
  
  // Guardar los nombres existentes antes de limpiar
  for (let i = 0; i < restriccionCount; i++) {
    const input = document.getElementById(`nombre_r${i}`);
    if (input) {
      nombresActuales[i] = input.value;
    }
  }
  
  container.innerHTML = '';
  
  // Crear campos para todas las restricciones actuales
  for (let i = 0; i < restriccionCount; i++) {
    const nombreActual = nombresActuales[i] || '';
    container.innerHTML += `
      <div class="row mb-2 align-items-center">
        <div class="col-3">
          <span class="badge bg-success">R${i}</span>
        </div>
        <div class="col-9">
          <input type="text" class="form-control form-control-sm" 
                 placeholder="Nombre de la restricción (ej: Restricción ${i+1})" 
                 id="nombre_r${i}" value="${nombreActual}">
        </div>
      </div>
    `;
  }
}

function agregarRestriccion() {
  const cont = document.getElementById("restriccionesContainer");
  cont.innerHTML += crearFilaRestriccion(restriccionCount);
  restriccionCount++;
  actualizarNombresRestricciones();
}

function eliminarRestriccion(id) {
  if (restriccionCount > 1) {
    const fila = document.getElementById(`rest-${id}`);
    if (fila) {
      fila.remove();
      // Reordenar las restricciones
      restriccionCount--;
      renderRestricciones();
      actualizarNombresRestricciones();
    }
  }
}

function eliminarUltimaRestriccion() {
  if (restriccionCount > 0) {
    restriccionCount--;
    renderRestricciones();
    actualizarNombresRestricciones();
  }
}

// Navegación de tabs
function activarTab(tabId) {
  // Remover active de todos los tabs
  document.querySelectorAll('.nav-link').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.classList.remove('show', 'active');
  });
  
  // Activar el tab seleccionado
  document.getElementById(`${tabId}-tab`).classList.add('active');
  document.getElementById(tabId).classList.add('show', 'active');
}

function siguienteTab() {
  if (tabActual < 2) {
    tabActual++;
    const tabs = ['config', 'detalles', 'resultados'];
    activarTab(tabs[tabActual]);
  }
}

function anteriorTab() {
  if (tabActual > 0) {
    tabActual--;
    const tabs = ['config', 'detalles', 'resultados'];
    activarTab(tabs[tabActual]);
  }
}

// Ayuda
function mostrarAyuda() {
  const container = document.getElementById('ayudaContainer');
  if (container.style.display === 'none') {
    container.style.display = 'block';
  } else {
    container.style.display = 'none';
  }
}

// Validación y resolución
function validarYContinuar() {
  // Obtener datos del modelo
  const objetivo = obtenerFuncionObjetivo();
  const restricciones = obtenerRestricciones();
  
  if (!objetivo || restricciones.length === 0) {
    alert('Por favor complete la función objetivo y al menos una restricción');
    return;
  }
  
  // Resolver el modelo
  resolverModelo(objetivo, restricciones);
  
  // Ir al tab de resultados
  tabActual = 2;
  activarTab('resultados');
}

function obtenerFuncionObjetivo() {
  const coefs = [];
  for (let i = 0; i < variableCount; i++) {
    const input = document.querySelector(`input[name="c_X${i}"]`);
    const value = input ? parseFloat(input.value) || 0 : 0;
    coefs.push(value);
  }
  return coefs;
}

function obtenerRestricciones() {
  const restricciones = [];
  for (let i = 0; i < restriccionCount; i++) {
    const coefs = [];
    for (let j = 0; j < variableCount; j++) {
      const input = document.querySelector(`input[name="r${i}_x${j}"]`);
      const value = input ? parseFloat(input.value) || 0 : 0;
      coefs.push(value);
    }
    
    const opSelect = document.querySelector(`select[name="r${i}_op"]`);
    const rhsInput = document.querySelector(`input[name="r${i}_rhs"]`);
    
    const operador = opSelect ? opSelect.value : '<=';
    const rhs = rhsInput ? parseFloat(rhsInput.value) || 0 : 0;
    
    restricciones.push({
      coefficients: coefs,
      operator: operador,
      rhs: rhs
    });
  }
  return restricciones;
}

// Resolución del modelo
function resolverModelo(objetivo, restricciones) {
  if (metodoActual === 'grafico' && variableCount === 2) {
    modeloResuelto = resolverGrafico(objetivo, restricciones);
  } else {
    modeloResuelto = resolverSimplex(objetivo, restricciones);
  }
  
  mostrarResultados();
}

function resolverGrafico(objetivo, restricciones) {
  // Encontrar los puntos de intersección
  const puntos = [];
  
  // Agregar origen
  puntos.push([0, 0]);
  
  // Intersecciones con ejes
  restricciones.forEach((r, i) => {
    if (r.coefficients[0] !== 0 && r.operator !== '>') {
      puntos.push([r.rhs / r.coefficients[0], 0]);
    }
    if (r.coefficients[1] !== 0 && r.operator !== '>') {
      puntos.push([0, r.rhs / r.coefficients[1]]);
    }
  });
  
  // Intersecciones entre restricciones
  for (let i = 0; i < restricciones.length; i++) {
    for (let j = i + 1; j < restricciones.length; j++) {
      const punto = interseccionLineas(restricciones[i], restricciones[j]);
      if (punto) puntos.push(punto);
    }
  }
  
  // Filtrar puntos factibles
  const puntosFactibles = puntos.filter(punto => esPuntoFactible(punto, restricciones));
  
  // Evaluar función objetivo en cada punto
  let mejorPunto = null;
  let mejorValor = optimizacionActual === 'max' ? -Infinity : Infinity;
  
  puntosFactibles.forEach(punto => {
    const valor = objetivo[0] * punto[0] + objetivo[1] * punto[1];
    if ((optimizacionActual === 'max' && valor > mejorValor) ||
        (optimizacionActual === 'min' && valor < mejorValor)) {
      mejorValor = valor;
      mejorPunto = punto;
    }
  });
  
  return {
    puntoOptimo: mejorPunto,
    valorOptimo: mejorValor,
    puntosFactibles: puntosFactibles,
    restricciones: restricciones,
    objetivo: objetivo
  };
}

function interseccionLineas(r1, r2) {
  const det = r1.coefficients[0] * r2.coefficients[1] - r1.coefficients[1] * r2.coefficients[0];
  if (Math.abs(det) < 1e-10) return null;
  
  const x = (r1.rhs * r2.coefficients[1] - r2.rhs * r1.coefficients[1]) / det;
  const y = (r1.coefficients[0] * r2.rhs - r2.coefficients[0] * r1.rhs) / det;
  
  return [x, y];
}

function esPuntoFactible(punto, restricciones) {
  return restricciones.every(r => {
    const valor = r.coefficients[0] * punto[0] + r.coefficients[1] * punto[1];
    switch (r.operator) {
      case '<=': return valor <= r.rhs + 1e-10;
      case '>=': return valor >= r.rhs - 1e-10;
      case '=': return Math.abs(valor - r.rhs) < 1e-10;
      default: return true;
    }
  });
}

function resolverSimplex(objetivo, restricciones) {
  // Implementación básica del método Simplex
  // Esta es una versión simplificada
  alert('El método Simplex está en desarrollo. Por favor use el método gráfico para 2 variables.');
  return null;
}

// Mostrar resultados
function mostrarResultados() {
  if (!modeloResuelto) return;
  
  // Mostrar valor óptimo
  document.getElementById('resultadoOptimo').textContent = 
    modeloResuelto.valorOptimo.toFixed(2);
  
  // Llenar tabla de resultados
  const tbody = document.getElementById('tablaResultados');
  tbody.innerHTML = '';
  
  if (modeloResuelto.puntoOptimo) {
    for (let i = 0; i < variableCount; i++) {
      const nombre = document.getElementById(`nombre_x${i}`)?.value || `X${i}`;
      const valor = modeloResuelto.puntoOptimo[i] || 0;
      tbody.innerHTML += `
        <tr class="table-optimal">
          <td>${nombre}</td>
          <td>${valor.toFixed(2)}</td>
        </tr>
      `;
    }
  }
  
  // Crear gráfico
  crearGrafico();
  
  // Crear resumen
  crearResumen();
}

function crearGrafico() {
  if (!modeloResuelto || variableCount !== 2) return;
  
  const traces = [];
  
  // Agregar líneas de restricciones
  modeloResuelto.restricciones.forEach((r, i) => {
    const x = [0, 10];
    const y = x.map(val => (r.rhs - r.coefficients[0] * val) / r.coefficients[1]);
    
    const nombreR = document.getElementById(`nombre_r${i}`)?.value || `R${i}`;
    
    traces.push({
      x: x,
      y: y,
      mode: 'lines',
      name: nombreR,
      line: { width: 2 }
    });
  });
  
  // Agregar puntos factibles
  if (modeloResuelto.puntosFactibles) {
    const x = modeloResuelto.puntosFactibles.map(p => p[0]);
    const y = modeloResuelto.puntosFactibles.map(p => p[1]);
    
    traces.push({
      x: x,
      y: y,
      mode: 'markers',
      name: 'Puntos Factibles',
      marker: { size: 8, color: 'blue' }
    });
  }
  
  // Agregar punto óptimo
  if (modeloResuelto.puntoOptimo) {
    traces.push({
      x: [modeloResuelto.puntoOptimo[0]],
      y: [modeloResuelto.puntoOptimo[1]],
      mode: 'markers',
      name: 'Punto Óptimo',
      marker: { size: 15, color: 'red', symbol: 'star' }
    });
  }
  
  const layout = {
    title: 'Solución Gráfica del Problema de Programación Lineal',
    xaxis: { title: document.getElementById('nombre_x0')?.value || 'X0' },
    yaxis: { title: document.getElementById('nombre_x1')?.value || 'X1' },
    showlegend: true
  };
  
  Plotly.newPlot('grafico', traces, layout);
}

function crearResumen() {
  const container = document.getElementById('resumenSolucion');
  if (!modeloResuelto) return;
  
  let html = `
    <div class="small">
      <p><strong>Método utilizado:</strong> ${metodoActual === 'grafico' ? 'Gráfico' : 'Simplex'}</p>
      <p><strong>Tipo de optimización:</strong> ${optimizacionActual === 'max' ? 'Maximización' : 'Minimización'}</p>
      <p><strong>Número de variables:</strong> ${variableCount}</p>
      <p><strong>Número de restricciones:</strong> ${restriccionCount}</p>
  `;
  
  if (modeloResuelto.puntoOptimo) {
    html += `<p><strong>Solución óptima:</strong><br>`;
    for (let i = 0; i < variableCount; i++) {
      const nombre = document.getElementById(`nombre_x${i}`)?.value || `X${i}`;
      html += `${nombre} = ${modeloResuelto.puntoOptimo[i].toFixed(2)}<br>`;
    }
    html += `</p>`;
  }
  
  html += `</div>`;
  container.innerHTML = html;
}

// Funciones de exportación
function exportarGrafico() {
  if (document.getElementById('grafico').innerHTML) {
    Plotly.toImage('grafico', {format: 'png', width: 800, height: 600})
      .then(function(url) {
        const link = document.createElement('a');
        link.download = 'grafico-programacion-lineal.png';
        link.href = url;
        link.click();
      });
  }
}

function exportarTabla() {
  const tabla = document.getElementById('tablaFinal');
  let csv = '';
  
  // Headers
  const headers = tabla.querySelectorAll('thead th');
  headers.forEach((header, i) => {
    csv += header.textContent + (i < headers.length - 1 ? ',' : '\n');
  });
  
  // Rows
  const rows = tabla.querySelectorAll('tbody tr');
  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    cells.forEach((cell, i) => {
      csv += cell.textContent + (i < cells.length - 1 ? ',' : '\n');
    });
  });
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'resultados-programacion-lineal.csv';
  link.click();
}

function imprimirResultados() {
  window.print();
}

function nuevoProblema() {
  if (confirm('¿Desea iniciar un nuevo problema? Se perderán todos los datos actuales.')) {
    limpiarModelo();
  }
}

function toggleSombra() {
  mostrarSombra = !mostrarSombra;
  const btn = event.target.closest('button');
  
  if (mostrarSombra) {
    btn.innerHTML = '<i class="bi bi-eye-slash me-1"></i>Ocultar Sombra de las Restricciones';
  } else {
    btn.innerHTML = '<i class="bi bi-eye me-1"></i>Ver Sombra de las Restricciones';
  }
  
  // Recrear el gráfico con o sin sombra
  crearGrafico();
}


function mostrarReferencias() {
  const container = document.getElementById('referenciasContainer');
  const btn = event.target.closest('button');
  
  if (container.style.display === 'none') {
    container.style.display = 'block';
    btn.innerHTML = '<i class="bi bi-eye-slash me-1"></i>Ocultar tabla de puntos';
  } else {
    container.style.display = 'none';
    btn.innerHTML = '<i class="bi bi-eye me-1"></i>Ver tabla de puntos';
  }
}

// Función mejorada para mostrar resultados
function mostrarResultados() {
  if (!modeloResuelto) return;
  
  // Mostrar valor óptimo
  document.getElementById('resultadoOptimo').textContent = 
    modeloResuelto.valorOptimo.toFixed(2);
  
  // Llenar tabla de referencias con todos los puntos
  llenarTablaReferencias();
  
  // Crear gráfico
  crearGrafico();
  
  // Actualizar análisis de sensibilidad
  actualizarAnalisisSensibilidad();
}

function llenarTablaReferencias() {
  const tbody = document.getElementById('tablaReferencias');
  tbody.innerHTML = '';
  
  if (!modeloResuelto || !modeloResuelto.puntosFactibles) return;
  
  // Evaluar cada punto factible
  const puntosEvaluados = modeloResuelto.puntosFactibles.map((punto, index) => {
    const valor = modeloResuelto.objetivo[0] * punto[0] + modeloResuelto.objetivo[1] * punto[1];
    const esOptimo = Math.abs(valor - modeloResuelto.valorOptimo) < 1e-6;
    
    // Calcular variables de holgura
    const holguras = modeloResuelto.restricciones.map(r => {
      const valorRestriccion = r.coefficients[0] * punto[0] + r.coefficients[1] * punto[1];
      return Math.max(0, r.rhs - valorRestriccion);
    });
    
    return {
      punto: punto,
      valor: valor,
      esOptimo: esOptimo,
      holguras: holguras,
      index: index
    };
  });
  
  // Ordenar por valor (descendente para maximización, ascendente para minimización)
  puntosEvaluados.sort((a, b) => {
    return optimizacionActual === 'max' ? b.valor - a.valor : a.valor - b.valor;
  });
  
  // Generar filas de la tabla
  puntosEvaluados.forEach((puntoEval, i) => {
    const fila = document.createElement('tr');
    if (puntoEval.esOptimo) {
      fila.className = 'table-success fw-bold';
    }
    
    let html = `
      <td class="text-center">${puntoEval.esOptimo ? `P-${i} - ÓPTIMO` : `P-${i}`}</td>
      <td class="text-center">${puntoEval.valor.toFixed(2)}</td>
      <td class="text-center">${puntoEval.punto[0].toFixed(2)}</td>
      <td class="text-center">${puntoEval.punto[1].toFixed(2)}</td>
    `;
    
    // Agregar variables de holgura
    puntoEval.holguras.forEach(holgura => {
      html += `<td class="text-center">${holgura.toFixed(2)}</td>`;
    });
    
    fila.innerHTML = html;
    tbody.appendChild(fila);
  });
}

function actualizarAnalisisSensibilidad() {
  const container = document.getElementById('analisisSensibilidad');
  
  if (!modeloResuelto || !modeloResuelto.puntoOptimo) {
    container.innerHTML = '<p class="small text-muted">No disponible sin solución óptima</p>';
    return;
  }
  
  let html = `
    <div class="row">
      <div class="col-md-6">
        <h6 class="text-primary">Variables de Decisión:</h6>
        <ul class="list-unstyled small">`;
  
  for (let i = 0; i < variableCount; i++) {
    const nombre = document.getElementById(`nombre_x${i}`)?.value || `X${i}`;
    const valor = modeloResuelto.puntoOptimo[i];
    const rangoMin = Math.max(0, valor - valor * 0.3);
    const rangoMax = valor + valor * 0.3;
    
    html += `<li><strong>${nombre}:</strong> Valor actual: ${valor.toFixed(2)} | Rango recomendado: [${rangoMin.toFixed(2)}, ${rangoMax.toFixed(2)}]</li>`;
  }
  
  html += `</ul>
      </div>
      <div class="col-md-6">
        <h6 class="text-primary">Restricciones:</h6>
        <ul class="list-unstyled small">`;
  
  modeloResuelto.restricciones.forEach((r, i) => {
    const nombre = document.getElementById(`nombre_r${i}`)?.value || `R${i}`;
    const valorRestriccion = r.coefficients[0] * modeloResuelto.puntoOptimo[0] + 
                           r.coefficients[1] * modeloResuelto.puntoOptimo[1];
    const holgura = r.rhs - valorRestriccion;
    const esActiva = Math.abs(holgura) < 1e-6;
    
    html += `<li><strong>${nombre}:</strong> ${esActiva ? 'Activa' : 'No activa'} | Holgura: ${holgura.toFixed(2)}</li>`;
  });
  
  html += `</ul>
      </div>
    </div>`;
  
  container.innerHTML = html;
}

// Función para exportar resultados completos
function exportarResultados() {
  const resultados = {
    valorOptimo: modeloResuelto?.valorOptimo || 0,
    puntoOptimo: modeloResuelto?.puntoOptimo || [],
    puntosFactibles: modeloResuelto?.puntosFactibles || [],
    restricciones: modeloResuelto?.restricciones || [],
    objetivo: modeloResuelto?.objetivo || []
  };
  
  const blob = new Blob([JSON.stringify(resultados, null, 2)], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'resultados-programacion-lineal.json';
  link.click();
}

function crearGrafico() {
  if (!modeloResuelto || variableCount !== 2) return;
  
  const traces = [];
  
  // Determinar límites del gráfico
  const maxX = Math.max(100, ...modeloResuelto.restricciones.map(r => 
    r.coefficients[0] !== 0 ? r.rhs / r.coefficients[0] : 0
  )) * 1.2;
  const maxY = Math.max(100, ...modeloResuelto.restricciones.map(r => 
    r.coefficients[1] !== 0 ? r.rhs / r.coefficients[1] : 0
  )) * 1.2;
  
  // Crear región factible sombreada
  if (mostrarSombra) {
    const regionFactible = calcularRegionFactible(maxX, maxY);
    if (regionFactible.length > 0) {
      traces.push({
        x: regionFactible.map(p => p[0]),
        y: regionFactible.map(p => p[1]),
        fill: 'toself',
        fillcolor: 'rgba(76, 175, 80, 0.3)',
        line: { color: 'rgba(76, 175, 80, 0)' },
        name: 'Región Factible',
        showlegend: true,
        hoverinfo: 'name'
      });
    }
  }
  
  // Agregar líneas de restricciones
  modeloResuelto.restricciones.forEach((r, i) => {
    if (r.coefficients[0] === 0 && r.coefficients[1] === 0) return;
    
    let x, y;
    const nombreR = document.getElementById(`nombre_r${i}`)?.value || `Restricción ${i + 1}`;
    
    if (r.coefficients[1] !== 0) {
      // Línea no vertical
      x = [0, maxX];
      y = x.map(val => (r.rhs - r.coefficients[0] * val) / r.coefficients[1]);
    } else {
      // Línea vertical
      x = [r.rhs / r.coefficients[0], r.rhs / r.coefficients[0]];
      y = [0, maxY];
    }
    
    // Colores para las líneas de restricciones
    const colores = ['#e74c3c', '#3498db', '#9b59b6', '#f39c12', '#1abc9c', '#34495e'];
    const color = colores[i % colores.length];
    
    traces.push({
      x: x,
      y: y,
      mode: 'lines',
      name: nombreR,
      line: { 
        width: 3, 
        color: color,
        dash: r.operator === '=' ? 'solid' : (r.operator === '<=' ? 'dash' : 'dot')
      },
      showlegend: true
    });
    
    // Agregar etiqueta de la restricción
    const midX = x[0] + (x[1] - x[0]) * 0.5;
    const midY = y[0] + (y[1] - y[0]) * 0.5;
    
    if (midX >= 0 && midX <= maxX && midY >= 0 && midY <= maxY) {
      traces.push({
        x: [midX],
        y: [midY],
        mode: 'text',
        text: [`${nombreR}`],
        textposition: 'middle center',
        textfont: {
          size: 12,
          color: color,
          family: 'Arial Black'
        },
        showlegend: false,
        hoverinfo: 'skip'
      });
    }
  });
  
  // Agregar puntos factibles (vértices)
  if (modeloResuelto.puntosFactibles && modeloResuelto.puntosFactibles.length > 0) {
    const puntosValidos = modeloResuelto.puntosFactibles.filter(p => 
      p[0] >= 0 && p[1] >= 0 && p[0] <= maxX && p[1] <= maxY
    );
    
    if (puntosValidos.length > 0) {
      const x = puntosValidos.map(p => p[0]);
      const y = puntosValidos.map(p => p[1]);
      const valores = puntosValidos.map(p => 
        (modeloResuelto.objetivo[0] * p[0] + modeloResuelto.objetivo[1] * p[1]).toFixed(2)
      );
      
      traces.push({
        x: x,
        y: y,
        mode: 'markers+text',
        name: 'Puntos Factibles',
        marker: { 
          size: 12, 
          color: '#2c3e50',
          symbol: 'circle',
          line: { width: 2, color: 'white' }
        },
        text: valores.map((v, i) => `(${x[i].toFixed(1)}, ${y[i].toFixed(1)})<br>Z=${v}`),
        textposition: 'top center',
        textfont: { size: 10, color: '#2c3e50' },
        showlegend: true
      });
    }
  }
  
  // Agregar punto óptimo destacado
  if (modeloResuelto.puntoOptimo) {
    const [optX, optY] = modeloResuelto.puntoOptimo;
    const valorOptimo = modeloResuelto.valorOptimo;
    
    traces.push({
      x: [optX],
      y: [optY],
      mode: 'markers+text',
      name: 'Punto Óptimo',
      marker: { 
        size: 20, 
        color: '#e74c3c',
        symbol: 'star',
        line: { width: 3, color: '#c0392b' }
      },
      text: [`ÓPTIMO<br>(${optX.toFixed(2)}, ${optY.toFixed(2)})<br>Z = ${valorOptimo.toFixed(2)}`],
      textposition: 'top center',
      textfont: { 
        size: 12, 
        color: '#e74c3c', 
        family: 'Arial Black' 
      },
      showlegend: true
    });
  }
  
  // Agregar líneas de la función objetivo (isolíneas)
  if (modeloResuelto.objetivo[0] !== 0 || modeloResuelto.objetivo[1] !== 0) {
    const valorOptimo = modeloResuelto.valorOptimo;
    const pasos = [-0.5, 0, 0.5, 1]; // Múltiples isolíneas
    
    pasos.forEach(paso => {
      const valorZ = valorOptimo * (1 + paso * 0.3);
      if (valorZ > 0) {
        let x, y;
        
        if (modeloResuelto.objetivo[1] !== 0) {
          x = [0, maxX];
          y = x.map(val => (valorZ - modeloResuelto.objetivo[0] * val) / modeloResuelto.objetivo[1]);
        } else {
          x = [valorZ / modeloResuelto.objetivo[0], valorZ / modeloResuelto.objetivo[0]];
          y = [0, maxY];
        }
        
        const esOptima = Math.abs(paso) < 0.1;
        
        traces.push({
          x: x,
          y: y,
          mode: 'lines',
          name: esOptima ? `F.O. = ${valorZ.toFixed(0)} (Óptima)` : `F.O. = ${valorZ.toFixed(0)}`,
          line: { 
            width: esOptima ? 4 : 2, 
            color: esOptima ? '#e74c3c' : '#95a5a6',
            dash: esOptima ? 'solid' : 'dot'
          },
          showlegend: esOptima,
          opacity: esOptima ? 1 : 0.6
        });
      }
    });
  }
  
  // Configuración del layout
  const nombreX = document.getElementById('nombre_x0')?.value || 'X₀';
  const nombreY = document.getElementById('nombre_x1')?.value || 'X₁';
  
  const layout = {
    title: {
      text: `<b>Solución Gráfica - Programación Lineal</b><br><span style="font-size: 14px; color: #7f8c8d;">Método Gráfico para ${optimizacionActual === 'max' ? 'Maximización' : 'Minimización'}</span>`,
      font: { size: 18, color: '#2c3e50' }
    },
    xaxis: { 
      title: { 
        text: `<b>${nombreX}</b>`, 
        font: { size: 14, color: '#2c3e50' } 
      },
      range: [0, maxX],
      showgrid: true,
      gridcolor: '#ecf0f1',
      showline: true,
      linecolor: '#bdc3c7',
      tickfont: { size: 12 }
    },
    yaxis: { 
      title: { 
        text: `<b>${nombreY}</b>`, 
        font: { size: 14, color: '#2c3e50' } 
      },
      range: [0, maxY],
      showgrid: true,
      gridcolor: '#ecf0f1',
      showline: true,
      linecolor: '#bdc3c7',
      tickfont: { size: 12 }
    },
    showlegend: true,
    legend: {
      x: 1.02,
      y: 1,
      bgcolor: 'rgba(255, 255, 255, 0.8)',
      bordercolor: '#bdc3c7',
      borderwidth: 1,
      font: { size: 11 }
    },
    plot_bgcolor: '#ffffff',
    paper_bgcolor: '#f8f9fa',
    margin: { l: 60, r: 150, t: 80, b: 60 },
    hovermode: 'closest'
  };
  
  const config = {
    displayModeBar: true,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
    displaylogo: false,
    responsive: true
  };
  
  Plotly.newPlot('grafico', traces, layout, config);
}

// Función auxiliar para calcular la región factible
function calcularRegionFactible(maxX, maxY) {
  if (!modeloResuelto.puntosFactibles) return [];
  
  // Ordenar puntos para formar un polígono
  const puntos = [...modeloResuelto.puntosFactibles]
    .filter(p => p[0] >= 0 && p[1] >= 0 && p[0] <= maxX && p[1] <= maxY);
  
  if (puntos.length < 3) return [];
  
  // Calcular el centroide
  const centroX = puntos.reduce((sum, p) => sum + p[0], 0) / puntos.length;
  const centroY = puntos.reduce((sum, p) => sum + p[1], 0) / puntos.length;
  
  // Ordenar puntos por ángulo respecto al centroide
  puntos.sort((a, b) => {
    const anguloA = Math.atan2(a[1] - centroY, a[0] - centroX);
    const anguloB = Math.atan2(b[1] - centroY, b[0] - centroX);
    return anguloA - anguloB;
  });
  
  // Cerrar el polígono agregando el primer punto al final
  puntos.push(puntos[0]);
  
  return puntos;
}


let referenciasMostradas = true;

// Función para alternar visibilidad de la tabla de referencias
function toggleReferencias() {
  const container = document.getElementById('tablaReferenciasContainer');
  const icono = document.getElementById('iconoToggleReferencias');
  const texto = document.getElementById('textoToggleReferencias');
  
  if (referenciasMostradas) {
    container.style.display = 'none';
    icono.className = 'bi bi-eye me-1';
    texto.textContent = 'Ver referencias';
    referenciasMostradas = false;
  } else {
    container.style.display = 'block';
    icono.className = 'bi bi-eye-slash me-1';
    texto.textContent = 'Ocultar referencias';
    referenciasMostradas = true;
  }
}

// Función para actualizar las referencias cuando se resuelve el problema
function actualizarReferenciasResultados() {
  actualizarVariablesReferencias();
  actualizarRestriccionesReferencias();
  actualizarTablaResultados();
}

// Actualizar variables en referencias
function actualizarVariablesReferencias() {
  const container = document.getElementById('variablesReferencias');
  container.innerHTML = '';
  
  // Obtener datos de las variables desde los campos de entrada
  const numVariables = document.querySelectorAll('[id^="coef_"]').length;
  
  for (let i = 0; i < numVariables; i++) {
    const nombreInput = document.getElementById(`nombre_x${i}`);
    const coefInput = document.getElementById(`coef_${i}`);
    
    if (nombreInput && coefInput) {
      const nombre = nombreInput.value || `Variable ${i}`;
      const coef = coefInput.value || '0';
      
      const div = document.createElement('div');
      div.className = 'row mb-2';
      div.innerHTML = `
        <div class="col-auto">
          <span class="badge bg-primary me-2">X${i}</span>
          <span class="text-muted">${nombre}</span>
          <span class="badge bg-secondary ms-2">€ ${coef}</span>
        </div>
      `;
      container.appendChild(div);
    }
  }
}

// Actualizar restricciones en referencias
function actualizarRestriccionesReferencias() {
  const container = document.getElementById('restriccionesReferencias');
  container.innerHTML = '';
  
  // Obtener datos de las restricciones desde los campos de entrada
  const restriccionesInputs = document.querySelectorAll('[id^="nombre_restriccion_"]');
  
  restriccionesInputs.forEach((input, index) => {
    const nombre = input.value || `Restricción ${index}`;
    
    // Construir fórmula de la restricción
    let formula = '';
    const numVariables = document.querySelectorAll('[id^="coef_"]').length;
    
    for (let i = 0; i < numVariables; i++) {
      const coefInput = document.getElementById(`r${index}_x${i}`);
      if (coefInput && coefInput.value) {
        const coef = parseFloat(coefInput.value) || 0;
        if (coef !== 0) {
          if (formula && coef > 0) formula += ' + ';
          if (coef < 0) formula += ' - ';
          formula += `${Math.abs(coef)} X${i}`;
        }
      }
    }
    
    const tipoSelect = document.getElementById(`tipo_r${index}`);
    const limiteInput = document.getElementById(`limite_r${index}`);
    const tipo = tipoSelect ? tipoSelect.value : '≤';
    const limite = limiteInput ? limiteInput.value : '0';
    
    if (formula) {
      formula += ` ${tipo} ${limite}`;
    }
    
    const div = document.createElement('div');
    div.className = 'mb-2';
    div.innerHTML = `
      <span class="badge bg-success me-2">R${index}</span>
      <span class="text-muted">${nombre}</span>
      <span class="badge bg-info ms-2">${formula}</span>
    `;
    container.appendChild(div);
  });
}

// Actualizar tabla de resultados (aquí conectarías con tus cálculos)
function actualizarTablaResultados() {
  const header = document.getElementById('tablaResultadosHeader');
  const body = document.getElementById('tablaResultadosBody');
  
  // Limpiar tabla
  header.innerHTML = '';
  body.innerHTML = '';
  
  // Obtener número de variables para crear columnas dinámicas
  const numVariables = document.querySelectorAll('[id^="coef_"]').length;
  const numRestricciones = document.querySelectorAll('[id^="nombre_restriccion_"]').length;
  
  // Crear encabezado
  const headerRow = document.createElement('tr');
  
  // Columnas básicas
  const columnas = ['Punto', 'Resultado'];
  
  // Agregar columnas de variables
  for (let i = 0; i < numVariables; i++) {
    columnas.push(`X${i}`);
  }
  
  // Agregar columnas de variables de holgura
  for (let i = 0; i < numRestricciones; i++) {
    columnas.push(`S${i}`);
  }
  
  columnas.forEach(columna => {
    const th = document.createElement('th');
    th.className = 'text-center';
    th.textContent = columna;
    headerRow.appendChild(th);
  });
  header.appendChild(headerRow);
  
  // Aquí deberías conectar con tus cálculos reales
  // Por ahora, creo un ejemplo con datos vacíos
  crearFilaEjemplo(body, columnas.length, 'P-0 - ÓPTIMO', true);
  crearFilaEjemplo(body, columnas.length, 'P-1', false);
}

function crearFilaEjemplo(tbody, numColumnas, nombrePunto, esOptimo) {
  const row = document.createElement('tr');
  if (esOptimo) {
    row.className = 'table-success fw-bold';
  }
  
  for (let i = 0; i < numColumnas; i++) {
    const td = document.createElement('td');
    td.className = 'text-center';
    
    if (i === 0) {
      td.textContent = nombrePunto;
    } else {
      td.textContent = '0.00'; // Aquí conectarías con tus cálculos reales
    }
    
    row.appendChild(td);
  }
  
  tbody.appendChild(row);
}

// Función para conectar con tu sistema de cálculos
function conectarConCalculos(resultados) {
  const header = document.getElementById('tablaResultadosHeader');
  const body = document.getElementById('tablaResultadosBody');
  
  // Limpiar tabla
  header.innerHTML = '';
  body.innerHTML = '';
  
  if (!resultados || resultados.length === 0) return;
  
  // Crear encabezado dinámicamente
  const headerRow = document.createElement('tr');
  const columnas = Object.keys(resultados[0]);
  
  columnas.forEach(columna => {
    const th = document.createElement('th');
    th.className = 'text-center';
    th.textContent = columna;
    headerRow.appendChild(th);
  });
  header.appendChild(headerRow);
  
  // Crear filas de datos
  resultados.forEach((punto) => {
    const row = document.createElement('tr');
    
    // Marcar la fila óptima
    if (punto.esOptimo) {
      row.className = 'table-success fw-bold';
    }
    
    columnas.forEach(columna => {
      const td = document.createElement('td');
      td.className = 'text-center';
      td.textContent = punto[columna];
      row.appendChild(td);
    });
    
    body.appendChild(row);
  });
}

// Llamar esta función cuando resuelvas el problema
function resolverProblemaYActualizar() {
  // Aquí va tu lógica de resolución existente
  // ...
  
  // Después de resolver, actualizar las referencias
  actualizarReferenciasResultados();
  
  // Si tienes resultados calculados, úsalos así:
  // const resultadosCalculados = [
  //   { 'Punto': 'P-0 - ÓPTIMO', 'Resultado': '2600.00', 'X0': '20.00', 'X1': '60.00', 'S0': '0.00', 'S1': '0.00', esOptimo: true },
  //   // ... más resultados
  // ];
  // conectarConCalculos(resultadosCalculados);
}







// Función principal para actualizar las referencias
function actualizarReferencias() {
  // Obtener datos actuales de los inputs
  modeloActual.variables[0].nombre = document.getElementById('nombre_x0').value || 'Variable 0';
  modeloActual.variables[0].coeficiente = parseFloat(document.getElementById('coef_x0').value) || 0;
  modeloActual.variables[1].nombre = document.getElementById('nombre_x1').value || 'Variable 1';
  modeloActual.variables[1].coeficiente = parseFloat(document.getElementById('coef_x1').value) || 0;
  
  modeloActual.restricciones[0].nombre = document.getElementById('nombre_r0').value || 'Restricción 0';
  modeloActual.restricciones[0].ecuacion = document.getElementById('ecuacion_r0').value || '';
  modeloActual.restricciones[1].nombre = document.getElementById('nombre_r1').value || 'Restricción 1';
  modeloActual.restricciones[1].ecuacion = document.getElementById('ecuacion_r1').value || '';
  
  // Actualizar la sección de variables
  actualizarVariablesReferencias();
  
  // Actualizar la sección de restricciones
  actualizarRestriccionesReferencias();
  
  // Actualizar la tabla de resultados
  actualizarTablaReferencias();
}

function actualizarVariablesReferencias() {
  const container = document.getElementById('variablesReferencias');
  container.innerHTML = '';
  
  modeloActual.variables.forEach((variable, index) => {
    const div = document.createElement('div');
    div.className = 'row mt-2';
    div.innerHTML = `
      <div class="col-auto">
        <span class="badge bg-primary me-2">X${index}</span>
        <span class="text-muted">${variable.nombre}</span>
        <span class="badge bg-secondary ms-2">€ ${variable.coeficiente}</span>
      </div>
    `;
    container.appendChild(div);
  });
}

function actualizarRestriccionesReferencias() {
  const container = document.getElementById('restriccionesReferencias');
  container.innerHTML = '';
  
  modeloActual.restricciones.forEach((restriccion, index) => {
    const div = document.createElement('div');
    div.className = 'mb-2';
    div.innerHTML = `
      <span class="badge bg-success me-2">R${index}</span>
      <span class="text-muted">${restriccion.nombre}</span>
      <span class="badge bg-info ms-2">${restriccion.ecuacion}</span>
    `;
    container.appendChild(div);
  });
}

function actualizarTablaReferencias() {
  const tbody = document.getElementById('tablaReferencias');
  tbody.innerHTML = '';
  
  modeloActual.resultados.forEach(resultado => {
    const tr = document.createElement('tr');
    if (resultado.esOptimo) {
      tr.className = 'table-success fw-bold';
    }
    
    tr.innerHTML = `
      <td class="text-center">${resultado.punto}</td>
      <td class="text-center">${resultado.resultado.toFixed(2)}</td>
      <td class="text-center">${resultado.x0.toFixed(2)}</td>
      <td class="text-center">${resultado.x1.toFixed(2)}</td>
      <td class="text-center">${resultado.s0.toFixed(2)}</td>
      <td class="text-center">${resultado.s1.toFixed(2)}</td>
    `;
    
    tbody.appendChild(tr);
  });
  
  // Actualizar también el resultado óptimo principal
  const resultadoOptimo = modeloActual.resultados.find(r => r.esOptimo);
  if (resultadoOptimo) {
    document.getElementById('resultadoOptimo').textContent = resultadoOptimo.resultado.toFixed(0);
  }
}

function recalcularResultados() {
  // Simular nuevos cálculos basados en los coeficientes actuales
  const coef0 = modeloActual.variables[0].coeficiente;
  const coef1 = modeloActual.variables[1].coeficiente;
  
  // Recalcular los resultados (esto es una simulación)
  modeloActual.resultados[0].resultado = (20 * coef0) + (60 * coef1);
  modeloActual.resultados[1].resultado = (50 * coef0) + (0 * coef1);
  modeloActual.resultados[2].resultado = (0 * coef0) + (80 * coef1);
  
  // Actualizar la tabla
  actualizarTablaReferencias();
  
  // Mostrar mensaje de confirmación
  alert('Resultados recalculados con los nuevos coeficientes');
}

function mostrarReferencias() {
  const container = document.getElementById('referenciasContainer');
  if (container.style.display === 'none') {
    container.style.display = 'block';
    event.target.innerHTML = '<i class="bi bi-eye-slash me-1"></i>Ocultar referencias';
  } else {
    container.style.display = 'none';
    event.target.innerHTML = '<i class="bi bi-eye me-1"></i>Ver referencias';
  }
}

// Función para agregar una nueva variable dinámicamente
function agregarVariable() {
  const nuevoIndex = modeloActual.variables.length;
  modeloActual.variables.push({
    nombre: `Variable ${nuevoIndex}`,
    coeficiente: 0
  });
  actualizarReferencias();
}

// Función para agregar una nueva restricción dinámicamente


// Funciones que puedes integrar con tu código existente
function obtenerDatosDelModelo() {
  // Esta función debe obtener los datos de tus paneles de configuración
  // y actualizar el objeto modeloActual
  
  // Ejemplo de cómo integrar con tu código existente:
  const variables = [];
  const restricciones = [];
  
  // Obtener variables de tus inputs existentes
  document.querySelectorAll('[id^="nombre_x"]').forEach((input, index) => {
    if (input.value) {
      const coefInput = document.getElementById(`coef_x${index}`);
      variables.push({
        nombre: input.value,
        coeficiente: parseFloat(coefInput?.value) || 0
      });
    }
  });
  
  // Obtener restricciones de tus inputs existentes
  document.querySelectorAll('[id^="nombre_r"]').forEach((input, index) => {
    if (input.value) {
      const ecuacionInput = document.getElementById(`ecuacion_r${index}`);
      restricciones.push({
        nombre: input.value,
        ecuacion: ecuacionInput?.value || ''
      });
    }
  });
  
  // Actualizar el modelo
  if (variables.length > 0) modeloActual.variables = variables;
  if (restricciones.length > 0) modeloActual.restricciones = restricciones;
  
  // Actualizar las referencias
  actualizarReferencias();
}


// Inicialización
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar con valores por defecto
  renderObjetivo();
  renderRestricciones();
  actualizarNombresVariables();
  actualizarNombresRestricciones();
  actualizarReferencias();
  
  // Agregar una restricción por defecto
  agregarRestriccion();
});