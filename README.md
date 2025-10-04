# Naturafy - Landing Page

## Estructura del Proyecto

```
Landing Page/
├── index.html          # Archivo principal con navegación
├── styles.css          # Estilos CSS separados
├── js/
│   └── tabs.js         # JavaScript para manejo de pestañas
└── tabs/
    ├── inicio.html     # Contenido de la pestaña Inicio
    ├── productos.html  # Contenido de la pestaña Productos
    ├── comunidad.html  # Contenido de la pestaña Comunidad
    ├── recursos.html   # Contenido de la pestaña Recursos
    └── contacto.html   # Contenido de la pestaña Contacto
```

## Características

### Arquitectura Modular
- **Separación de responsabilidades**: HTML, CSS y JavaScript en archivos separados
- **Contenido modular**: Cada pestaña en su propio archivo
- **Carga dinámica**: El contenido se carga según sea necesario
- **Cache inteligente**: El contenido se guarda en memoria para mejor rendimiento

### Pestañas Disponibles
1. **Inicio** - Página principal con hero section
2. **Productos** - Funcionalidades y características del sistema
3. **Comunidad** - Galería de plantas y comunidad
4. **Recursos** - Guías, tutoriales y herramientas (requiere login)
5. **Contacto** - Información de contacto

### Sistema de Login
- Botones de "Iniciar sesión" en todas las pestañas
- Sección especial de recursos que requiere autenticación
- Diseño consistente en toda la aplicación

## Cómo Funciona

### Carga Dinámica de Contenido
1. Al hacer clic en una pestaña, el sistema:
   - Verifica si el contenido está en cache
   - Si no está, lo descarga del archivo correspondiente
   - Muestra el contenido con animación suave
   - Guarda en cache para futuras cargas

### Ventajas de esta Estructura
- **Mantenimiento fácil**: Cada pestaña se puede editar independientemente
- **Rendimiento optimizado**: Solo se carga el contenido necesario
- **Escalabilidad**: Fácil agregar nuevas pestañas
- **Organización clara**: Separación lógica de componentes

## Desarrollo

### Para agregar una nueva pestaña:
1. Crear archivo en `/tabs/nueva-pestana.html`
2. Actualizar el mapeo en `js/tabs.js` (objeto `tabFiles`)
3. Agregar enlace en la navegación del `index.html`

### Para modificar una pestaña existente:
- Simplemente editar el archivo correspondiente en `/tabs/`
- Los cambios se reflejarán automáticamente

## Notas Técnicas

- **Compatibilidad**: Funciona con navegadores modernos
- **Responsive**: Diseño adaptable a dispositivos móviles
- **SEO**: Estructura HTML semántica
- **Accesibilidad**: Navegación por teclado y lectores de pantalla

## Personalización

Los estilos se encuentran en `styles.css` y están organizados por secciones:
- Navegación
- Contenido de pestañas
- Secciones específicas (hero, features, community, etc.)
- Responsive design

El sistema de pestañas es completamente personalizable a través de `js/tabs.js`.