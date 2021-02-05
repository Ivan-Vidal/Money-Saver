const Modal = {
    open () {
        //abrir modal
        //adicionar a class active ao modal
        document.querySelector('.modal-overlay').classList.add('active')
    },
    close () {
        //fechar o modal
        //remover a class active do modal
        document.querySelector('.modal-overlay').classList.remove('active')
    }
}

const Storange = {
    
    get () {
        return JSON.parse(localStorage.getItem("money.saver:transactions")) || []
    },
    
    set (transactions) {
        localStorage.setItem("money.saver:transactions", JSON.stringify(transactions))
    }   
}
const Transaction = {
    all: Storange.get(),
    
    add (transaction) {
        Transaction.all.push(transaction)
        App.reload()
    },
    
    remove (index) {
        Transaction.all.splice(index,1)
        
        App.reload()
    },
    
    incomes () {
        let income = 0;
        Transaction.all.forEach(transaction =>{
            if (transaction.amount > 0){
                income += transaction.amount;
            }
        })
        
        return income
        
    },
    
    
    
    expenses () {
        let expense = 0;
        Transaction.all.forEach(transaction =>{
            if (transaction.amount < 0){
                expense += transaction.amount;
            }
        })
        
        return expense
    },
    
    total () {
        return Transaction.incomes() + Transaction.expenses()
    }
    
}


const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),
    
    addTransaction (transaction,index) {
        
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index
        
        DOM.transactionsContainer.appendChild(tr)
        
    },
    
    innerHTMLTransaction (transaction, index){
        const CSSclass = transaction.amount > 0 ? "income":"expense"
        
        const amount = Utils.formatCurrency(transaction.amount)
        
        const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td><img  onclick="Transaction.remove(${index})" class="img-up" src="./menos.svg" alt="Remover transação">
        </td>
        `
        return html
    },
    
    updateBalance () {
        document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes())
        
        document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses())
        
        document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total())
    },
    
    clearTransactions () {
        DOM.transactionsContainer.innerHTML = ''
    }
}

const Utils = { 
    formAmount (value) {
        value = Number(value) * 100
        
        return Math.round(value)
    },
    formatDate(date) {
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },
    
    formatCurrency(value){
        const signal = Number(value) < 0 ? "-" : ""
        
        value = String(value).replace(/\D/g, "")
        
        value = Number(value) / 100
        
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        })
        
        return signal + value
        
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),
    
    getValues(){
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value,
        }
        
    },
    
    validadeField (){
        const {description, amount, date} = Form.getValues()
        
        if (description.trim() === "" || amount.trim() === "" || date.trim() === "")
        {
            throw new Error("Por Favor preencha todos os campos")
        }
    },
    
    formatValues () {
        let {description, amount, date} = Form.getValues()
        
        amount = Utils.formAmount(amount)
        
        date = Utils.formatDate(date)
        
        return {
            description,
            amount,
            date
        }        
    },
    clearFields () {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
        
    },
    
    submit(event){
        event.preventDefault()
        
        try {
            
            Form.validadeField()
            
            const transaction = Form.formatValues()
            
            Transaction.add(transaction)
            
            Form.clearFields()
            
            Modal.close()
            
            
            
            
            
        } catch (error) {   
           
            document.querySelector('.alert').classList.add('alertando')

           
        }
        
    }
}

const App = {
    init () {
        Transaction.all.forEach(DOM.addTransaction)
        
        DOM.updateBalance()

        Storange.set(Transaction.all)
        
    },
    reload () {
        DOM.clearTransactions()
        App.init()
    }
}

const fecha =  {
    closed(){
          document.querySelector('.alert').classList.remove('alertando');
    }
  
}


App.init()
