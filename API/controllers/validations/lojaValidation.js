// Descrição: Arquivo responsável por fazer a validação de acesso do usuario a loja 

const mongoose = require('mongoose')

const Usuario = mongoose.model('Usuario')
const Loja = mongoose.model('Loja')

module.exports = (req, res, next) => {
  // Se não for passado um id = Acesso não autorizado
  if(!req.payload.id) return res.sendStatus(401)
  const { loja } = req.query
  // Se não for passada uma loja = Acesso não autorizado
  if(!loja) return res.sendStatus(401)

  Usuario.findById(req.payload.id)
    .then(usuario => {
      // Se não foi usuario = Acesso não autorizado
      if(!usuario) return res.sendStatus(401)
      // Se não usuario não tiver loja cadastrada = Acesso não autorizado
      if(!usuario.loja) return res.sendStatus(401)
      // Se não usuario não foi admin = Acesso não autorizado
      if(!usuario.permissao.includes('admin')) return res.sendStatus(401)
      // Se a loja que usuario esta cadastrado não for a loja que ele está querendo alterar = Acesso não autorizado
      if(usuario.loja.toString() !== loja) return res.sendStatus(401)
      next()
    }).catch(next)
}