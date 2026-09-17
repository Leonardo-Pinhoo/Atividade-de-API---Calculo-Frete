const freightByRegion = {
  SP: 18, RJ: 22, MG: 24, ES: 26, PR: 27, SC: 30, RS: 34,
  GO: 32, DF: 30, MS: 32, MT: 38, BA: 39, SE: 42, PE: 44,
  AL: 45, PB: 47, RN: 49, CE: 50, PI: 52, MA: 54, PA: 58,
  TO: 48, RO: 62, AC: 68, AM: 70, RR: 75, AP: 72
}

const form = document.querySelector('#freight-form')
const cepInput = document.querySelector('#cep')
const message = document.querySelector('#message')
const result = document.querySelector('#result')

// Máscara visual 00000-000 enquanto digita
cepInput.addEventListener('input', () => {
  const digits = cepInput.value.replace(/\D/g, '').slice(0, 8)
  cepInput.value = digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits
  form.classList.remove('is-invalid')
  message.textContent = ''
})

form.addEventListener('submit', async (event) => {
  event.preventDefault()
  const cleanCep = cepInput.value.replace(/\D/g, '')
  message.textContent = ''
  form.classList.remove('is-invalid')
  result.hidden = true

  if (cleanCep.length !== 8) {
    form.classList.add('is-invalid')
    message.textContent = 'Digite um CEP válido com 8 números.'
    cepInput.focus()
    return
  }

  const button = form.querySelector('button')
  button.disabled = true
  button.textContent = 'Consultando...'

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
    if (!response.ok) throw new Error('Erro ao consultar o serviço de CEP.')

    const data = await response.json()
    if (data.erro) throw new Error('CEP não encontrado.')

    document.querySelector('#location').textContent = `${data.localidade} - ${data.uf}`
    document.querySelector('#address').textContent = `${data.logradouro || 'Logradouro não informado'}, ${data.bairro || 'Bairro não informado'}`
    document.querySelector('#result-cep').textContent = data.cep

    const freight = freightByRegion[data.uf] || 60
    document.querySelector('#freight').textContent = `R$ ${freight.toFixed(2).replace('.', ',')}`
    result.hidden = false
  } catch (error) {
    form.classList.add('is-invalid')
    message.textContent = error.message || 'Não foi possível consultar o CEP.'
  } finally {
    button.disabled = false
    button.textContent = 'Calcular frete'
  }
})
