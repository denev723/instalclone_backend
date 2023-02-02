import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import client from "../../client";

export default {
    Mutation: {
        login: async (_, { username, password }) => {
            // username을 갖는 유저를 찾음
            const user = await client.user.findFirst({
                where: {
                    username
                }
            });
            if (!user) {
                return {
                    ok: false,
                    error: "User not found."
                };
            }
            // password와 db의 password를 체크
            const correctPassword = await bcrypt.compare(
                password,
                user.password
            );
            if (!correctPassword) {
                return {
                    ok: false,
                    error: "Incorrect password"
                };
            }
            // token 생성 및 유저 반환
            const token = await jwt.sign(
                { id: user.id },
                process.env.SECRET_KEY
            );
            return {
                ok: true,
                token
            };
        }
    }
};
