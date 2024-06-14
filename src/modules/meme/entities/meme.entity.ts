import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity({ name: "memes" })
export class MemeEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column({ nullable: true })
    description: string
    
    @Column({ default: true })
    isActive: boolean

    @Column({ default: 0 })
    drawnTimes: number

    @Column()
    image: string

    @CreateDateColumn()
    createdAt: Date
    
    @UpdateDateColumn()
    updatedAt: Date

    static create(meme: Omit<MemeEntity, 'id' | 'createdAt' | 'updatedAt' | 'drawnTimes' | 'isActive'>) : MemeEntity {
        const entity = new MemeEntity()
        entity.title = meme.title;
        entity.description = meme.description;
        entity.drawnTimes = 0;
        entity.isActive = true;
        entity.image = meme.image;
        return entity;
    }
}