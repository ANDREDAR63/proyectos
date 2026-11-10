package com.ejemplo.tienda;

public class Practica {
    public static void main(String[] args) {
        String nombre = "Camiseta";
        int stock = 10;
        double precio = 45000.0;
        boolean disponible = true;

		System.out.println("---2. Hola desde java puro---\n");
		System.out.println("---3.Variables y tipos de datos---\n");
        System.out.println("Producto: " + nombre);
        System.out.println("Stock: " + stock);
        System.out.println("Precio: $" + precio);
        System.out.println("Disponible: " + disponible);

        System.out.println("---4. Operadores y condicionales---\n");
        
        if (stock == 0) {
            System.out.println("Agotado");
        } else if (stock < 5) {
            System.out.println("Quedan pocas unidades");
        } else {
            System.out.println("Stock suficiente");
        }

        if (precio > 40000) {
            System.out.println("Producto caro");
        }

        double precioConIva = precio * 1.19;
        System.out.println("Precio con IVA: $" + precioConIva);

        // ciclos
        for (int i = 1; i <= 5; i++) {
            System.out.println("Unidad " + i);
        }

        int contador = 3;
        while (contador > 0) {
            System.out.println(contador);
            contador--;
        }
        System.out.println("¡Listo!");

        // metodos
        double iva1 = calcularIva(45000);
        double iva2 = calcularIva(25000);
        System.out.println("IVA camiseta: $" + iva1);
        System.out.println("IVA gorra: $" + iva2);

        double desc1 = calcularDescuento(45000, 10);
        double desc2 = calcularDescuento(25000, 20);
        System.out.println("Descuento camiseta: $" + desc1);
        System.out.println("Descuento gorra: $" + desc2);

        // crear objetos
        Producto p1 = new Producto("Camiseta", 45000, 10);
        Producto p2 = new Producto("Gorra", 25000, 0);

        System.out.println(p1.getNombre() + " con IVA: $" + p1.precioConIva());
        System.out.println(p2.getNombre() + " con IVA: $" + p2.precioConIva());

        System.out.println("¿Hay 3 camisetas? " + p1.hayStock(3));
        System.out.println("¿Hay 3 gorras? " + p2.hayStock(3));

        //multiplicar
        imprimirTabla(7);
    }

    public static double calcularIva(double precio) {
        return precio * 0.19;
    }

    public static double calcularDescuento(double precio, double porcentaje) {
        return precio * (porcentaje / 100);
    }

    public static void imprimirTabla(int numero) {
        for (int i = 1; i <= 10; i++) {
            System.out.println(numero + " x " + i + " = " + (numero * i));
        }
    }
}


class Producto {

    private String nombre;
    private double precio;
    private int stock;

    public Producto(String nombre, double precio, int stock) {
        this.nombre = nombre;
        this.precio = precio;
        this.stock = stock;
    }

    public String getNombre() {
        return nombre;
    }

    public double getPrecio() {
        return precio;
    }

    public int getStock() {
        return stock;
    }

    public double precioConIva() {
        return precio * 1.19;
    }

    public boolean hayStock(int cantidad) {
        return cantidad <= stock;
        }
}
