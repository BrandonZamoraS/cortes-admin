# Instrucciones para Codex

Este documento resume las reglas y convenciones que Codex debe seguir cuando trabaje dentro de este repositorio mediante la CLI.

## Entorno y comandos
- Ejecutar los comandos mediante `shell` con `["bash","-lc","<cmd>"]` y siempre fijar `workdir`.
- Usar herramientas rápidas (`rg`, `rg --files`) para búsquedas de texto o archivos.
- Aprovechar el modo `danger-full-access` con responsabilidad: no ejecutar acciones destructivas a menos que el usuario lo solicite explícitamente.
- Nunca revertir cambios ajenos ni modificar archivos fuera del alcance indicado por el usuario.

## Edición y formato
- Preferir ASCII salvo que el archivo ya utilice otros caracteres.
- Emplear `apply_patch` para ediciones de un solo archivo cuando sea práctico.
- Agregar comentarios solo cuando aclaren bloques complejos; evitar obviedades.
- No ejecutar comandos como `git reset --hard` o `git checkout --` sin instrucciones expresas.

## Herramienta de planificación
- Usar la herramienta de plan cuando la tarea no sea trivial (evitar planes de un solo paso).
- Actualizar el plan después de completar cada paso.

## Presentación del trabajo
- Responder con tono conciso y colaborativo, destacando primero los cambios realizados.
- Referenciar archivos usando rutas clicables (`ruta/archivo.ext:línea`).
- Ofrecer siguientes pasos lógicos (tests, builds, commits) solo cuando aporte valor.
- Para revisiones, priorizar hallazgos y riesgos antes de resumir.

## Validación y pruebas
- Ejecutar pruebas o comandos de verificación cuando sea relevante y factible.
- Si alguna verificación no puede ejecutarse, informar las acciones necesarias para que el usuario la realice manualmente.

## Plantilla para instrucciones adicionales
# Documentación del Sistema — Gestión de Órdenes de Corte y Bultos  
**Estilo:** diseño sobrio, tonos azul (#1E3A8A) y blanco, bordes `rounded-sm`.

---

## 1. Descripción General

La aplicación es una demo web destinada a mostrar el manejo de inventario de láminas metálicas generadas a partir del proceso de corte de bobinas. No utiliza autenticación y cualquier persona con el enlace tendrá acceso completo.  
El sistema administra dos elementos principales: **órdenes de corte** y **bultos**, además del **historial de acciones** sobre cada bulto.

Todo el diseño del frontend debe mantener un estilo sobrio, predominando el fondo blanco con acentos en tonos azul oscuro (`#1E3A8A`). Los elementos interactivos deben utilizar bordes mínimos (`rounded-sm`).

---

## 2. Órdenes de Corte

Una **orden de corte** representa la transformación de una bobina metálica en múltiples bultos. Cada orden tiene un conjunto de atributos fundamentales.

### 2.1 Campos
- `id`: identificador único (UUID).  
- `numero_orden`: número de orden visible para el usuario.  
- `fecha`: fecha de realización del corte.  
- `cantidad_bultos`: número total de bultos generados.  
- `activo`: indica si la orden está vigente.  
- `creado_en`: fecha y hora del registro.

### 2.2 Funciones del Frontend
- Crear nuevas órdenes de corte.  
- Listar todas las órdenes de forma limpia sobre fondo blanco.  
- Cambiar estado activo/inactivo.  
- Ver detalles de cada orden.  

**Estilo recomendado:**  
- Cards blancas con borde gris suave.  
- Acentos en azul para títulos y botones.  
- Bordes `rounded-sm`.

---

## 3. Bultos

Cada **bulto** es un conjunto de láminas derivadas de una orden de corte. Su numeración es correlativa y única dentro de la orden.

### 3.1 Campos
- `id`: UUID.  
- `orden_corte_id`: referencia a la orden original.  
- `numero_bulto`: número correlativo.  
- `ubicacion_id`: referencia a la ubicación actual (C1–C4).  
- `cantidad_laminas`: cantidad de láminas contenidas.  
- `estado`: `disponible`, `asignado` o `usado`.  
- `creado_en` y `actualizado_en`: timestamps.

### 3.2 Funciones del Frontend
- Mostrar los bultos dentro de cada orden.  
- Actualizar ubicación del bulto.  
- Cambiar estado (asignado, usado).  
- Editar cantidad de láminas.  
- Acceder al historial.

**Estilo recomendado:**  
- Tabla en blanco con líneas gris claro.  
- Estados representados con texto en azul oscuro o gris.  
- Elementos interactivos con `rounded-sm`.

---

## 4. Ubicaciones

Las **ubicaciones** representan los espacios disponibles para almacenar los bultos.

### 4.1 Ubicaciones iniciales
- C1  
- C2  
- C3  
- C4  

Estas deben presentarse en listas desplegables con acentos en azul.

---

## 5. Historial de Acciones

Cada bulto tiene un historial que muestra todas las acciones realizadas sobre él.

### 5.1 Tipos de acción
- **Mover:** cambia el bulto a otra ubicación.  
- **Asignar:** vincula un número de trabajo ingresado libremente.  
- **Utilizar:** marca el bulto como usado.

### 5.2 Campos
- `id`: UUID.  
- `bulto_id`: referencia al bulto.  
- `accion`: tipo de acción.  
- `ubicacion_destino_id`: solo si la acción es mover.  
- `numero_trabajo`: solo si la acción es asignar.  
- `fecha_hora`: fecha y hora del registro.

### 5.3 Funciones del Frontend
- Mostrar historial cronológico.  
- Agregar nuevas acciones.  
- Formularios que cambian según tipo de acción.  

**Estilo recomendado:**  
- Línea de tiempo simple, fondo blanco, acentos azul oscuro.  
- Formularios minimalistas con campos limpios y `rounded-sm`.

---

## 6. Flujo del Frontend

### 6.1 Pantalla de Órdenes de Corte
- Lista en cards blancas con títulos en azul.  
- Botón “Nueva orden” con fondo azul y borde `rounded-sm`.

### 6.2 Vista de Detalle de Orden
- Sección superior con información de la orden.  
- Tabla blanca con bultos.  
- Botones discretos para acciones en cada bulto.

### 6.3 Pantalla de Bultos
Cada fila debe mostrar:
- Número de bulto.  
- Ubicación actual.  
- Estado.  
- Cantidad de láminas.  
- Botón “Historial”.

### 6.4 Pantalla de Historial
- Lista blanca con filas delgadas y timestamp a la derecha.  
- Formulario para nuevas acciones.

---

## 7. Reglas de Estilo del Frontend

- **Fondo general:** blanco.  
- **Color primario:** azul oscuro `#1E3A8A`.  
- **Color secundario:** azul suave `#3B82F6`.  
- **Tipografía:** limpia y moderna, preferiblemente sin serif.  
- **Bordes:** `rounded-sm` únicamente.  
- **Sombras:** sutiles, casi imperceptibles.  
- **Botones:** preferiblemente sólidos en azul o outline azul.

---

## 8. Base de Datos (Resumen)

### 8.1 Tablas Principales
- `ordenes_corte`  
- `ubicaciones`  
- `bultos`  
- `historial_bultos`

### 8.2 Enums
- `estado_bulto`  
- `accion_bulto`

### 8.3 Relaciones
- Una orden tiene muchos bultos.  
- Un bulto tiene una ubicación.  
- Un bulto tiene muchos registros de historial.  

---

## 9. Objetivo para el Desarrollo del Frontend

Este documento permite que Codex (o cualquier generador de código) tenga claridad total sobre:

- Estructura del sistema.  
- Entidades y relaciones.  
- Flujo esperado de pantallas.  
- Campos que deben consultarse o modificarse.  
- Estilo visual deseado.

El resultado debe ser un frontend sobrio, limpio y funcional, construido sobre esta base de datos y alineado al diseño descrito.

---

