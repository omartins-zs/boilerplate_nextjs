
import { signIn } from "@/auth"

export default function SignIn() {
    return (
        <>
            <form
                action={async () => {
                    "use server"
                    await signIn("google")
                }}
            >
                <button className="bg-fuchsia-400" type="submit">Signin with Google</button>
            </form>
            <form
                action={async () => {
                    "use server";
                    await signIn("github");
                }}
            >
                <button className="bg-emerald-400" type="submit">Sign in with GitHub</button>
            </form>
        </>


    )
}