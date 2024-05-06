let equiposPokemon = [];

if (localStorage.getItem('equiposPokemon')) {
    equiposPokemon = JSON.parse(localStorage.getItem('equiposPokemon'));
}

document.getElementById('agregar').addEventListener('click', async function () {
    const nombrePokemon = document.getElementById('nombre').value.toLowerCase();
    if (nombrePokemon === '') {
        alert('Error: El campo no puede quedar vacío :(');
        return;
    }
    const equipoActual = equiposPokemon[equiposPokemon.length - 1];
    if (!equipoActual || equipoActual.length === 3) {
        equiposPokemon.push([nombrePokemon]); 
        document.getElementById('nombre').value = ''; 
        console.log('Pokémon agregado:', nombrePokemon);
    } else if (equipoActual.length < 3) {
        equipoActual.push(nombrePokemon); 
        document.getElementById('nombre').value = ''; 
        console.log('Pokémon agregado:', nombrePokemon);
    }
    actualizarBotones();
});

document.getElementById('empezarDeNuevo').addEventListener('click', function () {
    limpiarPantalla();
    console.log('Equipo reiniciado');
    document.getElementById('agregar').disabled = false;
});


document.getElementById('calcular').addEventListener('click', async function () {
    if (equiposPokemon.length === 0 || equiposPokemon[equiposPokemon.length - 1].length !== 3) {
        alert('Error: Debes agregar 3 Pokémon para calcular');
        return;
    }
    const equipoActual = equiposPokemon[equiposPokemon.length - 1];
    const longitudAntes = equipoActual.length;
    for (const nombrePokemon of equipoActual) {
        await mostrarPokemon(nombrePokemon);
    }
    limpiarCampos(); 
    const longitudDespues = equiposPokemon[equiposPokemon.length - 1].length; 
    if (longitudDespues === longitudAntes) {
        alert('Error: No hay nuevos Pokémon para calcular');
    }
    document.getElementById('agregar').disabled = false;
});





async function mostrarPokemon(nombre) {
    const pokemonDiv = document.createElement('div');
    pokemonDiv.classList.add('pokemon-info');
    const pokemon = await obtenerPokemon(nombre);
    const imagenUrl = pokemon.sprites.front_default;
    const tipos = pokemon.types.map(type => type.type.name).join(', ');
    const nombrePokemon = pokemon.name;
    const idPokemon = pokemon.id;
    const experienciaBase = pokemon.base_experience;
    const primeraHabilidad = pokemon.abilities[0].ability.name;
    pokemonDiv.innerHTML = `
        <img src="${imagenUrl}" alt="${nombre}">
        <p>Nombre: ${nombrePokemon}</p>
        <p>ID: ${idPokemon}</p>
        <p>Tipo(s): ${tipos}</p>
        <p>Experiencia Base: ${experienciaBase}</p>
        <p>Primera Habilidad: ${primeraHabilidad}</p>
    `;
    document.getElementById('pokemones').appendChild(pokemonDiv);
    const pokemonOrdenado = equiposPokemon[equiposPokemon.length - 1].sort((a, b) => {
        return obtenerExperienciaBase(a) - obtenerExperienciaBase(b);
    });
    equiposPokemon[equiposPokemon.length - 1] = pokemonOrdenado;
}

        function actualizarBotones() {
            const equipoActual = equiposPokemon[equiposPokemon.length - 1];
            const botones = document.querySelectorAll('button');
            botones.forEach(btn => {
                btn.disabled = false;
            });
            if (!equipoActual || equipoActual.length === 3) {
                document.getElementById('agregar').disabled = true;
            }
            localStorage.setItem('equiposPokemon', JSON.stringify(equiposPokemon));
        }

        function limpiarPantalla() {
            document.getElementById('pokemones').innerHTML = '';
        }

        document.getElementById('actualizarHistorial').addEventListener('click', function () {
            mostrarHistorial();
        });
        

        function mostrarHistorial() {
            const historialDiv = document.getElementById('historialPokemones');
            historialDiv.innerHTML = '';
            equiposPokemon.forEach((equipo, index) => {
                const equipoOrdenado = equipo.sort((a, b) => {
                    return obtenerExperienciaBase(a) - obtenerExperienciaBase(b);
                });
                const equipoDiv = document.createElement('div');
                equipoDiv.classList.add('equipo');
                equipoDiv.innerHTML = `<h3>Equipo ${index + 1}</h3>`;
                equipoOrdenado.forEach(nombrePokemon => {
                    const pokemonDiv = document.createElement('div');
                    pokemonDiv.classList.add('pokemon-info');
                    const nombreDiv = document.createElement('div');
                    nombreDiv.textContent = nombrePokemon;
                    pokemonDiv.appendChild(nombreDiv);
                    obtenerPokemon(nombrePokemon).then(pokemon => {
                        const imagenUrl = pokemon.sprites.front_default;
                        const tipos = pokemon.types.map(type => type.type.name).join(', ');
                        const idPokemon = pokemon.id;
                        const experienciaBase = pokemon.base_experience;
                        const primeraHabilidad = pokemon.abilities[0].ability.name;
                        const detallesDiv = document.createElement('div');
                        detallesDiv.innerHTML = `
                            <img src="${imagenUrl}" alt="${nombre}">
                            <p>ID: ${idPokemon}</p>
                            <p>Tipo(s): ${tipos}</p>
                            <p>Experiencia Base: ${experienciaBase}</p>
                            <p>Primera Habilidad: ${primeraHabilidad}</p>
                        `;
                        pokemonDiv.appendChild(detallesDiv);
                    });
                    equipoDiv.appendChild(pokemonDiv);
                });
                historialDiv.appendChild(equipoDiv);
            });
        }

        document.getElementById('limpiarHistorial').addEventListener('click', function () {
            localStorage.removeItem('equiposPokemon');
            equiposPokemon = []; 
            mostrarHistorial(); 
            console.log('Historial limpiado');
        });
        
        
        function obtenerExperienciaBase(nombrePokemon) {
            const pokemon = equiposPokemon.find(equipo => equipo.includes(nombrePokemon));
            return pokemon ? pokemon.base_experience : 0;
        }
        async function obtenerPokemon(nombre) {
            const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`);
            return respuesta.json();
        }

        mostrarHistorial();