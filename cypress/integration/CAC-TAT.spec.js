/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function () {
    const THREEE_SECONDS_IN_MS = 3000 // CRIAR VARIÁVEL PARA A CONTAGEM DO TEMPO E NÃO PRECISAR REPETIR OS MS.
    this.beforeEach(function () {
        cy.visit('./src/index.html')
    })

    it('verifica o título da aplicação', function () {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    it('Preenche os campos obrigatórios e envia o formulário', function () {
        const longText = 'Teste, teste,teste, teste, teste, teste, teste,teste,teste,teste'

        cy.clock()

        cy.get('#firstName').type('Tatiane')
        cy.get('#lastName').type('Avellar')
        cy.get('#email').type('tatiane@exemplo.com')
        cy.get('#open-text-area').type(longText, { delay: 0 })
        cy.contains('button', 'Enviar').click()

        cy.get('.success').should('be.visible')

        cy.tick(THREEE_SECONDS_IN_MS)

        cy.get('.success').should('not.be.visible')

    })

    it('Exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function () {
        cy.clock()

        cy.get('#firstName').type('Tatiane')
        cy.get('#lastName').type('Avellar')
        cy.get('#email').type('tatiane@exemplo,com')
        cy.get('#open-text-area').type('Teste')
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')

        cy.tick(THREEE_SECONDS_IN_MS)

        cy.get('.error').should('not.be.visible')

    })

    Cypress._.times(3, function () {
        it('campo telefone continua vazio quando preenchido com valor não-numérico', function () {
            cy.get('#phone')
                .type('abcdefghij')
                .should('have.value', '')


        })
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function () {
        cy.clock()

        cy.get('#firstName').type('Tatiane')
        cy.get('#lastName').type('Avellar')
        cy.get('#email').type('tatiane@exemplo.com')
        cy.get('#phone-checkbox').click()
        cy.get('#open-text-area').type('Teste')
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')

        cy.tick(THREEE_SECONDS_IN_MS)

        cy.get('.error').should('not.be.visible')

    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', function () {
        cy.get('#firstName')
            .type('Tatiane')
            .should('have.value', 'Tatiane')
            .clear()
            .should('have.value', '')
        cy.get('#lastName')
            .type('Avellar')
            .should('have.value', 'Avellar')
            .clear()
            .should('have.value', '')
        cy.get('#email')
            .type('tatiane@exemplo.com')
            .should('have.value', 'tatiane@exemplo.com')
            .clear()
            .should('have.value', '')
        cy.get('#phone')
            .type('123456789')
            .should('have.value', '123456789')
            .clear()
            .should('have.value', '')

    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function () {
        cy.clock()
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')

        cy.tick(THREEE_SECONDS_IN_MS)

        cy.get('.error').should('not.be.visible')
    })

    it('envia o formuário com sucesso usando um comando customizado', function () {
        cy.clock()

        cy.fillMandatoryFieldsAndSubmit()

        cy.get('.success').should('be.visible')

        cy.tick(THREEE_SECONDS_IN_MS)

        cy.get('.success').should('not.be.visible')

    })

    it('seleciona um produto (YouTube) por seu texto', function () {
        cy.get('#product')
            .select('YouTube')
            .should('have.value', 'youtube')
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', function () {
        cy.get('#product')
            .select('mentoria')
            .should('have.value', 'mentoria')
    })

    it('seleciona um produto (Blog) por seu índice', function () {
        cy.get('#product')
            .select(1)
            .should('have.value', 'blog')
    })

    it('marca o tipo de atendimento "Feedback"', function () {
        cy.get('input[type="radio"][value="feedback"]')
            .check()
            .should('have.value', 'feedback')

    })

    it('marca cada tipo de atendimento', function () {
        cy.get('input[type="radio"]')
            .should('have.length', 3)
            .each(function ($radio) {
                cy.wrap($radio).check()
                cy.wrap($radio).should('be.checked')
            })

    })

    it('marca ambos checkboxes, depois desmarca o último', function () {
        cy.get('input[type="checkbox"]') // pega todos os inputs
            .check()
            .should('be.checked') //confirmar que ambos estão marcados
            .last() // pegar só o último marcado
            .uncheck() // desmarcar o que foi marcado por último
            .should('not.be.checked') //confirmar que só o último foi desmarcado
    })

    it('seleciona um arquivo da pasta fixtures', function () {
        cy.get('input[type="file"]')
            .should('not.have.value')//colocar uma verificação de que não há nenhum valor
            .selectFile('./cypress/fixtures/example.json')//selecionar o caminho do aqrquivo
            .should(function ($input) { // verificar se o arquivo correto foi selecionado
                expect($input[0].files[0].name).to.equal('example.json')
            })

    })

    it('seleciona um arquivo simulando um drag-and-drop', function () {
        cy.get('input[type="file"]')
            .should('not.have.value')//colocar uma verificação de que não há nenhum valor
            .selectFile('./cypress/fixtures/example.json', { action: 'drag-drop' })//selecionar o caminho do aqrquivo simulando drag-and-drop
            .should(function ($input) { // verificar se o arquivo correto foi selecionado
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function () {
        cy.get('#privacy a').should('have.attr', 'target', '_blank')// verificar se tem o target blank que indica que abre em outra aba
    })

    it('acessa a página da política de privacidade removendo o target e então clicando no link', function () {
        cy.get('#privacy a')// Remover o target para abrir na mesma aba
            .invoke('removeAttr', 'target')
            .click()

        cy.contains('Talking About Testing').should('be.visible')    // verificar se o conteúdo do texto está visível.
    })

    it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', function () {
        cy.get('.success')
            .should('not.be.visible')
            .invoke('show')
            .should('be.visible')
            .and('contain', 'Mensagem enviada com sucesso.')
            .invoke('hide')
            .should('not.be.visible')
        cy.get('.error')
            .should('not.be.visible')
            .invoke('show')
            .should('be.visible')
            .and('contain', 'Valide os campos obrigatórios!')
            .invoke('hide')
            .should('not.be.visible')
    })

    it('preenche a area de texto usando o comando invoke', function () {
        const longText = Cypress._.repeat('0123456789', 20) //._.repeat cria um texto longo numa variável, este terá 200 caracteres. invoca o valor sem digitar

        cy.get('#open-text-area')
            .invoke('val', longText)
            .should('have.value', longText)


    })

    it('faz uma requisição HTTP', function () {
        cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
            .should(function (response) {
                const { status, statusText, body } = response //desestruturar um objeto em javascript
                expect(status).to.equal(200)
                expect(statusText).to.equal('OK')
                expect(body).to.include('CAC TAT')
            })


    })

    it('encontra o gato escondido', function () {
        cy.get('#cat') // para o cato aparecer
            .invoke('show')
            .should('be.visible')
        cy.get('#title')
            .invoke('text', 'CAT TAT')
        cy.get('#subtitle')
            .invoke('text', 'Eu 💚 gatos!')
    })

})
