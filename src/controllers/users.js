const knex = require('../connection');
const optionsStack = [1, 2, 3];

const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
};

const getAllUser = async (req, res) => {

    const allUsers = await knex("users");

    return res.status(200).json(allUsers);

}

const getUser = async (req, res) => {
    const { id } = req.params;

    try {

        const user = await knex("stack")
            .join("users", "users.stack", "stack.id")
            .select("users.id", "users.name", "users.email", "stack.name as stack_name").where("users.id", id).first();

        if (!user) {
            return res.status(404).json({ "Message": "Usuário não encontrado." });
        }

        return res.status(200).json(user);

    } catch (error) {
        return res.status(400).json(error.message)
    }

}

const addUser = async (req, res) => {
    const { name, email, stack } = req.body;

    if (!name || !email || !stack) {
        return res.status(400).json({ "message": "Todos os campos devem estar preenchidos!" });
    }

    const validEmail = validateEmail(email);

    if (!validEmail) {
        return res.status(404).json({ "message": "E-mail inválido." })
    }

    const correctStack = optionsStack.includes(parseInt(stack));

    if (!correctStack) {
        return res.status(404).json({ "message": "Opção de stack inválida." })
    }

    try {

        const emailAlreadyUsed = await knex("users").where({ email }).first();

        if (emailAlreadyUsed) {
            return res.status(400).json({ "Message": "O E-mail informado já está em uso!" });
        }

        const user = await knex("users").insert({ name, email, stack });

        if (user.rowCount === 0) {
            return res.status(400).json({ "Message": "Não foi possível cadastrar o usuário." });
        }

        return res.status(201).json({ "Message": "Usuário cadastrado com sucesso!" });

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {

        const deletedUser = await knex("users").del().where({ id });

        if (deletedUser === 0) {
            return res.status(404).json({ "message": "User not found." })
        }

        return res.status(202).json({ "message": "User deleted successfully." })

    } catch (error) {
        return res.status(500).json(error.message);
    }
}

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, stack } = req.body;

    try {

        const user = await knex("users").where({ id }).update({ name, stack });

        if (user === 0) {
            return res.status(400).json({ "message": "Não foi possível atualizar o usuário." });
        }

        return res.status(202).json({ "message": "Usuário atualizado com sucesso." });

    } catch (error) {
        return res.status(500).json(error.message);
    }
}


module.exports = {
    getAllUser,
    getUser,
    addUser,
    deleteUser,
    updateUser
}