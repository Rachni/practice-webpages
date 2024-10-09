document.addEventListener("DOMContentLoaded", function () {
    // Array para almacenar los registros de los usuarios
    let users = [];

    // Referencia al formulario
    const form = document.getElementById("contactForm");

    // Manejador de eventos para el formulario
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Evita que el formulario se envíe de forma tradicional

        // Captura los valores de los campos del formulario
        const name = document.getElementById("name").value;
        const email = document.getElementById("emailContact").value;
        const message = document.getElementById("message").value;

        // Crea un objeto con los datos del usuario
        const user = {
            name: name,
            email: email,
            message: message
        };

        // Agrega el nuevo usuario al array de usuarios
        users.push(user);

        // Reinicia el formulario para permitir un nuevo registro
        form.reset();

        alert("Usuario registrado con éxito!");
    });

    // Función para descargar el archivo JSON con los registros de usuarios
    function downloadUsersAsJSON() {
        // Convierte el array de usuarios a una cadena JSON
        const json = JSON.stringify(users, null, 2);

        // Crea un Blob a partir de la cadena JSON
        const blob = new Blob([json], { type: "application/json" });

        // Crea una URL para el Blob
        const url = URL.createObjectURL(blob);

        // Crea un enlace para iniciar la descarga
        const a = document.createElement("a");
        a.href = url;
        a.download = "users.json";
        document.body.appendChild(a);
        a.click(); // Simula un clic para iniciar la descarga

        // Limpia el DOM
        document.body.removeChild(a);

        // Libera la URL creada
        URL.revokeObjectURL(url);
    }

    // Agrega el método de descarga a la consola para su uso
    window.downloadUsersAsJSON = downloadUsersAsJSON;
});
