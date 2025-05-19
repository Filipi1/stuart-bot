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
    ) {
        this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
    }

    async query<T>(table: string, query: any = {}) {
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