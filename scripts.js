// Función para mostrar uniformes según el precio seleccionado
function mostrarUniformes(precio) {
    const folderContainer = document.getElementById('folder-container');
    const catalogoUniformes = document.getElementById('catalogo_uniformes');
    const listaUniformes = document.getElementById('lista_uniformes');
    const tituloCarpeta = document.getElementById('titulo_carpeta');

    // Ocultar las carpetas de precios
    folderContainer.style.display = "none";

    // Mostrar el contenedor de uniformes
    catalogoUniformes.style.display = "block";
    tituloCarpeta.textContent = `Uniformes de $${precio}`;

    // Limpiar la lista actual
    listaUniformes.innerHTML = "";

    // Obtener los uniformes almacenados en localStorage
    const storedUniformes = JSON.parse(localStorage.getItem('uniformes')) || [];

    // Filtrar uniformes por precio
    const uniformesFiltrados = storedUniformes.filter(uniforme => uniforme.precio === precio);

    // Mostrar los uniformes filtrados
    if (uniformesFiltrados.length > 0) {
        uniformesFiltrados.forEach((uniforme) => {
            const item = document.createElement('div');
            item.classList.add('item');
            item.innerHTML = `
                <img src="${uniforme.imagen}" alt="${uniforme.nombre}">
                <h3>${uniforme.nombre}</h3>
                <p>Precio: $${uniforme.precio}</p>
                <p>${uniforme.descripcion}</p>
                <div class="tallas-container">
                    <label for="talla-ch">CH:</label>
                    <input type="number" id="talla-ch-${uniforme.nombre}" min="0" value="0">
                    <label for="talla-m">M:</label>
                    <input type="number" id="talla-m-${uniforme.nombre}" min="0" value="0">
                    <label for="talla-l">L:</label>
                    <input type="number" id="talla-l-${uniforme.nombre}" min="0" value="0">
                    <label for="talla-xl">XL:</label>
                    <input type="number" id="talla-xl-${uniforme.nombre}" min="0" value="0">
                </div>
                <button class="cotizar-btn" onclick="abrirWhatsApp('${uniforme.nombre}', ${uniforme.precio}, '${uniforme.nombre}')">Cotizar</button>
            `;
            listaUniformes.appendChild(item);
        });
    } else {
        listaUniformes.innerHTML = "<p>No hay uniformes en esta categoría.</p>";
    }
}

// Función para regresar a las carpetas de precios
function regresarACarpetas() {
    const folderContainer = document.getElementById('folder-container');
    const catalogoUniformes = document.getElementById('catalogo_uniformes');

    // Ocultar el contenedor de uniformes
    catalogoUniformes.style.display = "none";

    // Mostrar las carpetas de precios
    folderContainer.style.display = "flex";
}

// Función para abrir WhatsApp con tallas y cantidades
function abrirWhatsApp(nombre, precio, nombreUniforme) {
    const telefono = "528186912151";  // Número de WhatsApp con código de país (México: +52)
    const tallaCH = document.getElementById(`talla-ch-${nombreUniforme}`).value;
    const tallaM = document.getElementById(`talla-m-${nombreUniforme}`).value;
    const tallaL = document.getElementById(`talla-l-${nombreUniforme}`).value;
    const tallaXL = document.getElementById(`talla-xl-${nombreUniforme}`).value;

    const mensaje = `Hola, estoy interesado en cotizar el uniforme: ${nombre} (Precio: $${precio}).\n\nDetalle de tallas:\nCH: ${tallaCH}\nM: ${tallaM}\nL: ${tallaL}\nXL: ${tallaXL}`;
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
}

// Función para agregar múltiples uniformes
function agregarUniformes() {
    const precio = parseFloat(document.getElementById('precio').value.trim());
    const imagenInput = document.getElementById('imagen');
    const descripcion = document.getElementById('descripcion').value.trim();

    // Validar campos
    if (isNaN(precio)) {
        alert('Por favor, ingresa un precio válido.');
        return;
    }
    if (imagenInput.files.length === 0) {
        alert('Por favor, selecciona al menos una imagen.');
        return;
    }
    if (!descripcion) {
        alert('Por favor, ingresa una descripción.');
        return;
    }

    // Leer todas las imágenes seleccionadas
    const archivos = imagenInput.files;
    let uniformes = JSON.parse(localStorage.getItem('uniformes')) || [];

    for (let i = 0; i < archivos.length; i++) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const imagen = event.target.result;
            const nombre = `Uniforme ${uniformes.length + 1}`; // Nombre automático
            const nuevoUniforme = { nombre, precio, descripcion, imagen };

            // Guardar en localStorage
            uniformes.push(nuevoUniforme);
            localStorage.setItem('uniformes', JSON.stringify(uniformes));

            // Si es la última imagen, mostrar mensaje y recargar el catálogo
            if (i === archivos.length - 1) {
                alert(`${archivos.length} uniforme(s) agregado(s) correctamente.`);
                document.getElementById('precio').value = '';
                document.getElementById('imagen').value = '';
                document.getElementById('descripcion').value = '';
                cargarCatalogo();
            }
        };
        reader.readAsDataURL(archivos[i]);
    }
}

// Función para cargar el catálogo en la página de administración
function cargarCatalogo() {
    const catalogo = document.getElementById('catalogo');
    if (catalogo) {
        catalogo.innerHTML = "";
        const storedUniformes = JSON.parse(localStorage.getItem('uniformes')) || [];

        storedUniformes.forEach((uniforme, index) => {
            const item = document.createElement('div');
            item.classList.add('item');
            item.innerHTML = `
                <img src="${uniforme.imagen}" alt="${uniforme.nombre}">
                <h3>${uniforme.nombre}</h3>
                <p>Precio: $${uniforme.precio}</p>
                <p>${uniforme.descripcion}</p>
                <button class="delete-btn" onclick="eliminarUniforme(${index})">Eliminar</button>
                <button class="cotizar-btn" onclick="abrirWhatsApp('${uniforme.nombre}', ${uniforme.precio}, '${uniforme.nombre}')">Cotizar</button>
            `;
            catalogo.appendChild(item);
        });
    }
}

// Función para eliminar un uniforme
function eliminarUniforme(index) {
    if (confirm("¿Estás seguro de que deseas eliminar este uniforme?")) {
        let uniformes = JSON.parse(localStorage.getItem('uniformes')) || [];
        uniformes.splice(index, 1);
        localStorage.setItem('uniformes', JSON.stringify(uniformes));
        cargarCatalogo();
    }
}

// Función para cerrar sesión
function cerrarSesion() {
    // Eliminar el estado de sesión del localStorage
    localStorage.removeItem("adminLogueado");

    // Redirigir al usuario a la página de login
    window.location.href = "login.html";
}

// Verificar sesión al cargar la página de administración
document.addEventListener("DOMContentLoaded", function() {
    if (window.location.pathname.includes("admin.html")) {
        if (localStorage.getItem("adminLogueado") !== "true") {
            localStorage.removeItem("adminLogueado"); // Limpiar el estado
            alert("Acceso denegado. Debes iniciar sesión.");
            window.location.href = "login.html";
        }
        cargarCatalogo();
    }
});