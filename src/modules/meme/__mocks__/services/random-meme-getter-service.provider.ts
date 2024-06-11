import { RandomMemeGetterService } from "../../services/domain/random-meme-getter/random-meme-getter.service";

export const RandomMemeGetterServiceProvider = {
    provide: RandomMemeGetterService,
    useValue: {
        execute: jest.fn()
    }
}