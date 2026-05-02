import { generateShortCode } from "../services/short_code";
describe('generateShortCode',()=>{
    it('should return a string of length 7',async () =>{
        const code = await generateShortCode()
        expect(code).toHaveLength(7)
    })
})