export const formatPhone = (numero: string) => {
    return numero.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
};

export const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date(date));
};
