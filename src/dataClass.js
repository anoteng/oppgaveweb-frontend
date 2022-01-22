import Api from '@/api.js'
export class vurdering {

}

export class student {

}

export class emner {
    term
    courses
    constructor(term){
        this.term = term
        // this.courses = courses
    }
    loadCourses(){
        const promise = new Promise((resolve, reject) => {
            Api.get('vurderingsenhet', 'filter=termin,eq,' + this.term + '&join=emner,brukere&join=emner,faggrupper')
                .then(result => {
                    this.courses = result
                    resolve('Loaded all courses')
                })
                .catch(error => {reject(error)})
        })
        return promise
    }
    loadCourseStats(){
        const promise = new Promise((resolve, reject) =>{
            for(let i in this.courses){
               Api.get('vurderingsmelding', 'filter=vurderingsenhet,eq,' + this.courses[i].id)
                   .then(result => {
                       let stats = {
                           antall: 0,
                           komplett: 0,
                           veileder: 0,
                           kommisjon: 0
                       }
                       for(let melding in result){
                           stats.antall += 1
                           if(melding.locked){
                               stats.komplett += 1
                           }
                           if(melding.veileder){
                               stats.veileder += 1
                           }
                           if(melding.kommisjon){
                               stats.kommisjon += 1
                           }
                       }
                       this.courses[i].stats = stats
                       resolve('Loaded course stats')
                   })
                   .catch(err => {
                       reject(err)
                   })
            }
        })
        return promise
    }
    getIndexById(id) {
        for(let i in this.courses){
            if(this.courses[i].id === id){
                return i
            }
        }
        return false
    }
}