import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity({ name: "coachs" })
export class CoachEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    message: string

    @Column({ nullable: true })
    author: string

    @CreateDateColumn()
    createdAt: Date
    
    @UpdateDateColumn({ nullable: true })
    updatedAt: Date

    static create(meme: Omit<CoachEntity, 'id' | 'createdAt' | 'updatedAt'>) : CoachEntity {
        const entity = new CoachEntity()
        entity.message = meme.message;
        entity.author = meme.author;
        return entity;
    }
}