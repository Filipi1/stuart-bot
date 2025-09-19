import { Inject, Injectable } from '@nestjs/common';
import { AppEnvironment } from '../../enums/app-environment.enum';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
    private readonly supabase: any;

    constructor(
        @Inject(AppEnvironment.SUPABASE_URL)
        private readonly supabaseUrl: string,

        @Inject(AppEnvironment.SUPABASE_ANON_KEY)
        private readonly supabaseKey: string,

        @Inject(AppEnvironment.SUPABASE_SCHEMA)
        private readonly supabaseSchema: string,
    ) {
        this.supabase = createClient(this.supabaseUrl, this.supabaseKey, {
            db: {
                schema: this.supabaseSchema
            }
        });
    }

    async query<T>(table: string, query: any = {}) {
        // Handle random ordering as a special case
        if (query.orderBy === 'random()') {
            // For random ordering, we'll fetch all records and shuffle them in JavaScript
            // This is not ideal for large datasets, but works for small to medium tables
            let randomQuery = this.supabase.from(table).select('*');
            
            // Apply filters
            if (query.where) {
                Object.entries(query.where).forEach(([key, value]) => {
                    randomQuery = randomQuery.eq(key, value);
                });
            }
            
            // Get all records (we'll limit after shuffling)
            const { data, error } = await randomQuery;
            
            if (error) {
                throw error;
            }
            
            
            if (!data || data.length === 0) {
                return [];
            }
            
            // Shuffle the array using Fisher-Yates algorithm
            const shuffled = [...(data as T[])];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            
            // Apply pagination after shuffling
            let result = shuffled;
            if (query.offset) {
                result = result.slice(query.offset);
            }
            if (query.limit) {
                result = result.slice(0, query.limit);
            }
            
            console.log('Final shuffled result:', result);
            return result;
        }

        // Normal query for other cases
        let supabaseQuery = this.supabase.from(table).select('*');

        // Aplica filtros
        if (query.where) {
            Object.entries(query.where).forEach(([key, value]) => {
                supabaseQuery = supabaseQuery.eq(key, value);
            });
        }

        // Aplica ordenação
        if (query.orderBy) {
            supabaseQuery = supabaseQuery.order(query.orderBy, { ascending: query.order === 'ASC' });
        }

        // Aplica paginação
        if (query.limit) {
            supabaseQuery = supabaseQuery.limit(query.limit);
        }

        if (query.offset) {
            supabaseQuery = supabaseQuery.range(query.offset, query.offset + (query.limit || 10) - 1);
        }

        const { data, error } = await supabaseQuery;

        if (error) throw error;
        return data as T[];
    }

    async insert<T>(table: string, data: Partial<T>) {
        const { data: result, error } = await this.supabase
            .from(table)
            .insert(data)
            .select()
            .single();

        if (error) throw error;
        return result as T;
    }

    async update<T>(table: string, id: number | string, data: Partial<T>) {
        const { data: result, error } = await this.supabase
            .from(table)
            .update(data)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return result as T;
    }

    async delete(table: string, id: number | string) {
        const { error } = await this.supabase
            .from(table)
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
} 