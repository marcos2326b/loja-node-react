// Descrição: Arquivo responsável pela lógica das rotas do usuario

const mongoose = require('mongoose')
const Usuario = mongoose.model('Usuario')
const enviarEmailRecovery = require('../helpers/email-recovery')

class UsuarioController {
  // ----------------------------------------------------- LISTAGEM DE DADOS -----------------------------------------------------
  // GET /
  index(req, res, next) {
    // Busca o id
    Usuario.findById(req.payload.id)
      .then(usuario => {
        // Se não encontrar o id mostra um erro
        if (!usuario) return res.status(401).json({ errors: "Usuario não registrado" });
        // Se encontrar mostra envia os dados do usuario
        return res.json({ usuario: usuario.enviarAuthJSON() });
      }).catch(next);
  }

  // GET /:id
  show(req, res, next) {
    // Busca o id
    Usuario.findById(req.params.id)
      .populate({ path: 'loja' })
      .then(usuario => {
        // Se não encontrar o id mostra um erro
        if (!usuario) return res.status(401).json({ errors: 'Usuario não registrado!!' })
        // Se encontrar mostra retorna os dados do usuario
        return res.json({
          nome: usuario.nome,
          email: usuario.email,
          permissao: usuario.permissao,
          loja: usuario.loja
        })
      }).catch(next)
  }
  // --------------------------------------------------------------------------------------------------------------------------------

  // ----------------------------------------------------- AÇÕES DE USUARIOS -----------------------------------------------------
  // POST /login
  login(req, res, next) {
    // Pega os dados no body
    const { email, password } = req.body
    // Vefica se os dados passados estão vazios 
    if (!email) return res.status(422).json({ errors: { email: 'não pode ficar vazio!!' } })
    if (!password) return res.status(422).json({ errors: { password: 'não pode ficar vazio!!' } })

    // Busca pelo email
    Usuario.findOne({ email })
      .then((usuario) => {
        // Se não encontrar o email mostra um erro
        if (!usuario) return res.status(401).json({ errors: "Usuario não registrado" });
        // Verifica se a senha passada é valida
        if (!usuario.validarSenha(password)) return res.status(401).json({ errors: "Senha inválida" });
        // Retorna os dados do usuario
        return res.json({ usuario: usuario.enviarAuthJSON() });
      }).catch(next);
  }

  // POST /registrar
  store(req, res, next) {
    // Pega os dados no body
    const { nome, email, password, loja } = req.body
    // Verifica se os campoes estão vazios
    if (!nome || !email || !password || !loja) return res.status(422).json({ errors: '`Preencha todos os campos de cadastro!!' })

    // Cria um novo usuario
    const usuario = new Usuario({ nome, email, loja })
    usuario.setSenha(password)

    // Salva o novo usuario e mostra os dados
    usuario.save()
      .then(() => res.json({ usuario: usuario.enviarAuthJSON() }))
      .catch(next)
  }

  // PUT /
  update(req, res, next) {
    // Pega os dados no body
    const { nome, email, password } = req.body

    // Busca o id
    Usuario.findById(req.payload.id)
      .then((usuario) => {
        // Se não encontrar o id mostra um erro
        if (!usuario) return res.status(401).json({ errors: 'Usuario não registrado!!' })
        // Verifica os tipos dos dados e altera para os novos
        if (typeof nome !== 'undefined') usuario.nome = nome
        if (typeof email !== 'undefined') usuario.email = email
        if (typeof password !== 'undefined') usuario.setSenha(password)
        // Salva o usuario com os novos dados por fim mostra os dados
        return usuario.save().then(() => {
          return res.json({ usuario: usuario.enviarAuthJSON() })
        }).catch(next)
      }).catch(next)
  }

  // DELETE /
  remove(req, res, next) {
    // Busca o id
    Usuario.findById(req.payload.id)
      .then(usuario => {
        // Se não encontrar o id mostra um erro
        if (!usuario) return res.status(401).json({ errors: 'Usuario não registrado!!' })
        // Remove o usuario
        return usuario.remove()
          .then(() => {
            // Mostra 'deletado: true'
            return res.json({ deletado: true })
          }).catch(next)
      }).catch(next)
  }
  // --------------------------------------------------------------------------------------------------------------------------------

  // ----------------------------------------------------- RECUPERAÇÃO DE SENHA -----------------------------------------------------
  // GET /recuperar-senha
  showRecovery(req, res) {
    // Renderiza a página de preencher o email para recuperar senha
    return res.render('recovery', { error: null, success: null })
  }

  // POST /recuperar-senha
  createRecovery(req, res, next) {
    // Pega o email no body
    const { email } = req.body
    // Verifica se o email passado é vazio
    if (!email) return res.render('recovery', { error: 'Preencha com o seu email', success: null })

    // Busca pelo email
    Usuario.findOne({ email })
      .then((usuario) => {
        // Se não encontrar o email mostra um erro
        if (!usuario) return res.render('recovery', { error: 'Não existe usuario com este email', success: null })
        // Cria um token para a recuperação da senha
        const recoveryData = usuario.criarTokenRecuperacaoSenha()
        // 
        return usuario.save()
          .then(() => {
            // Chama a varíavel responsável por enviar o email
            enviarEmailRecovery({ usuario, recovery: recoveryData }, (error = null, success = null) => {
              // Renderiza a página de preencher o email para recuperar senha passando possíveis erros
              return res.render('recovery', { error, success })
            })
          }).catch(next)
      }).catch(next)
  }

  // GET /senha-recuperada
  showCompleteRecovery(req, res, next) {
    // Verifica se o token foi recebido
    if (!req.query.token) return res.render("recovery", { error: "Token não identificado", success: null });

    // Faz a busca pelo token recebido
    Usuario.findOne({ "recovery.token": req.query.token })
      .then(usuario => {
        // Se não encontrar usuario com esse token mostra um erro
        if (!usuario) return res.render("recovery", { error: "Não existe usuário com este token", success: null });
        // Verifica se o token foi expirado e rederiza a página passando um erro
        if (new Date(usuario.recovery.date) < new Date()) return res.render("recovery", { error: "Token expirado. Tente novamente.", success: null });
        // Renderiza a página de redefinição de senha passando o token
        return res.render("recovery/store", { error: null, success: null, token: req.query.token });
      }).catch(next);
  }

  // POST /senha-recuperada
  completeRecovery(req, res, next) {
    // Pega o token e a senha no body
    const { token, password } = req.body;
    // Verifica se os dados passados são vazios e renderiza a página de redefinição de senha
    if (!token || !password) return res.render("recovery/store", { error: "Preencha novamente com sua nova senha", success: null, token: token });

    // Faz a busca pelo token recebido
    Usuario.findOne({ "recovery.token": token })
      .then(usuario => {
        // Se não encontrar usuario com esse token mostra um erro
        if (!usuario) return res.render("recovery", { error: "Usuario nao identificado", success: null });
        // Quando verificar que está tudo correto no envio vai encerrar o token de recuperação de senha para que não possa ser usado novamente
        usuario.finalizarTokenRecuperacaoSenha();
        // Setta a nova senha
        usuario.setSenha(password);
        // Salva a nova senha do usuario
        return usuario.save()
          .then(() => {
            // Rederiza a página de redefinição de senha e passa o token para null
            return res.render("recovery/store", {
              error: null,
              success: "Senha alterada com sucesso. Tente novamente fazer login.",
              token: null
            });
          }).catch(next);
      });
  }
  // --------------------------------------------------------------------------------------------------------------------------------
}

module.exports = UsuarioController