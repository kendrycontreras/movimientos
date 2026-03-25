const listaContainer = document.getElementById('lista-movimientos');
const inputBusqueda = document.getElementById('busqueda');

async function cargarMovimientos(filtro = '') {
    listaContainer.innerHTML = '<p class="text-center text-gray-400">Consultando...</p>';

    let query = _supabase
        .from('movimientos')
        .select('*')
        .order('fecha', { ascending: false });

    if (filtro) {
        query = query.or(`nombre.ilike.%${filtro}%,banco_pagador.ilike.%${filtro}%`);
    }

    const { data, error } = await query;

    if (error) {
        listaContainer.innerHTML = `<p class="text-red-500">Error: ${error.message}</p>`;
        return;
    }

    render(data);
}

function render(items) {
    listaContainer.innerHTML = '';
    // --- LÓGICA DE SUMATORIA ---
    let sumaBs = 0;
    let sumaUsd = 0;

    if (items.length === 0) {
        listaContainer.innerHTML = '<p class="text-center text-gray-500">No hay registros</p>';
        return;
    }

    items.forEach(item => {
        // Sumamos los valores (asegurándonos de que sean números)
        sumaBs += parseFloat(item.monto_bs || 0);
        sumaUsd += parseFloat(item.monto_usd || 0);

        // --- LÓGICA DE COLORES PARA NÚMEROS NEGATIVOS ---
        // Si el monto es menor a 0, ponemos rojo (text-red-600), si no, verde (text-green-600)
        const colorBs = item.monto_bs < 0 ? 'text-red-600' : 'text-green-600';
        
        // Lo mismo para USD, pero un tono un poco más suave
        const colorUsd = item.monto_usd < 0 ? 'text-red-400' : 'text-gray-400';

        // Formateo de números (Puntos para miles y coma para decimales)
        const montoFormateado = parseFloat(item.monto_bs).toLocaleString('es-VE', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
        });

        const card = document.createElement('div');
        // Usamos la fuente Outfit que configuramos antes
        card.className = "bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-1 mb-4";
        
        card.innerHTML = `
            <div class="flex justify-between items-center border-b border-gray-50 pb-2 mb-2">
                <span class="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-lg uppercase">${item.fecha}</span>
                <span class="text-[10px] text-gray-300 font-mono">#${item.referencia}</span>
            </div>
            
            <div class="flex justify-between items-start">
                <div>
                    <h3 class="font-bold text-gray-800 leading-tight text-base">${item.nombre}</h3>
                    <p class="text-xs text-gray-500 font-light">${item.banco_pagador}</p>
                </div>
                
                <div class="text-right">
                    <p class="font-bold text-lg ${colorBs} tracking-tight">
                        ${montoFormateado} Bs.
                    </p>
                    
                    <p class="text-xs font-medium ${colorUsd}">${item.monto_usd > 0 ? `<p class="text-[10px] font-bold text-gray-400">$${item.monto_usd}</p>` : ''}
                    </p>
                </div>
            </div>
        `;
        listaContainer.appendChild(card);
    });
    // --- ACTUALIZAR LA BARRA INFERIOR ---
    const totalBsElement = document.getElementById('total-bs');
    const totalUsdElement = document.getElementById('total-usd');

    // Formatear el total de Bs para que se vea profesional
    totalBsElement.innerText = sumaBs.toLocaleString('es-VE', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    }) + " Bs.";

    // Color dinámico para el total (Rojo si el balance general es negativo)
    totalBsElement.className = `text-xl font-black font-[Outfit] ${sumaBs < 0 ? 'text-red-600' : 'text-gray-800'}`;

    totalUsdElement.innerText = `$${sumaUsd.toLocaleString('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    })}`;
}

// Escuchar búsqueda en móvil
inputBusqueda.addEventListener('input', (e) => {
    cargarMovimientos(e.target.value);
});

// Cargar al iniciar
if (listaContainer) cargarMovimientos();