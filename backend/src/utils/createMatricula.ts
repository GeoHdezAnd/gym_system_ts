export function createMatricula(
    name: string,
    last_name: string,
    phone: string
) {
    const nameInitials = name.slice(0, 2).toUpperCase();
    const lastNameInitials = last_name.slice(0, 2).toUpperCase();
    const telInitials = phone.slice(-4);

    return `${nameInitials}${lastNameInitials}-${telInitials}`;
}
