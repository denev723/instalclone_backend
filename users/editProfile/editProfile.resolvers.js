import client from "../../client";
import bcrypt from "bcrypt";
import { protectedResolver } from "../users.utils";

export default {
    Mutation: {
        editProfile: protectedResolver(
            async (
                _,
                {
                    firstName,
                    lastName,
                    username,
                    email,
                    password: newPassword,
                    bio,
                    avatar
                },
                { loggedInUser }
            ) => {
                const { filename, createReadStream } = await avatar;
                const stream = createReadStream();
                console.log(stream);
                console.log(filename, createReadStream);
                let uglyPassword = null;
                if (uglyPassword) {
                    uglyPassword = await bcrypt.hash(newPassword);
                }
                const updatedUser = await client.user.update({
                    where: { id: loggedInUser.id },
                    data: {
                        firstName,
                        lastName,
                        username,
                        email,
                        bio,
                        ...(uglyPassword && { password: uglyPassword })
                    }
                });
                if (updatedUser.id) {
                    return {
                        ok: true
                    };
                } else {
                    return {
                        ok: false,
                        error: "Could not update profile."
                    };
                }
            }
        )
    }
};
