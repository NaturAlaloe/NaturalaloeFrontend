import axios from 'axios';

export interface Facilitator {
    id: number;
    name: string;
    email: string;
    
}

export async function getFacilitators(): Promise<Facilitator[]> {
    const response = await axios.get<Facilitator[]>('/facilitators');
    return response.data;
}