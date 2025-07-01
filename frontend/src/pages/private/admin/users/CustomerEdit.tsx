import { useParams } from "react-router";

export default function CustomerEdit() {
    const { userId } = useParams();
    return (
        <div className="transition-all duration-300 ease-in-out transform hover:scale-105">
            <p>Vamos a editar el usuario</p>
            <p>{userId}</p>
        </div>
    );
}
