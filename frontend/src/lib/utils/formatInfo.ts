export const formatPhone = (numero: string) => {
    return numero.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
};

export const formatDate = (date: Date | string) => {
    // Asegurarnos de que tenemos un objeto Date
    const dateObj = typeof date === "string" ? new Date(date) : date;

    return new Intl.DateTimeFormat("es-MX", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
    }).format(dateObj);
};
