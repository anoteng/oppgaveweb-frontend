import Api from '@/api.js'
export const findUser = async (query, active = 1, onlySupervisors = false) => {
    if(onlySupervisors){
        query = query + '&filter=rolle,eq,2'
    }
    return await Api.get('brukere', 'filter=active,eq,' + active + '&filter=full_name,cs,' + query)
}