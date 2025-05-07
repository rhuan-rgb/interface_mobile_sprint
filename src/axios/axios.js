import axios from 'axios'

const api = axios.create({
    baseURL:"http://10.89.240.90:5000/api/reservas/v1/",
    headers:{
        'accept':'application/json'
    }
});

const sheets = {
    
    postLogin:(user)=>api.post("user/login", user),
    postCadastro:(user)=>api.post("user", user),
    getAllClassrooms:()=>api.get("classroom"),
    postSchedule:(sala)=>api.post("schedule", sala),

    getSchedulesByIdClassroomRanges: (class_id, dataInicio, dataTermino ) =>
        api.get(
          `/schedule/ranges/${class_id}?weekStart=${dataInicio}&weekEnd=${dataTermino}`
        ),
    
}

export default sheets;
