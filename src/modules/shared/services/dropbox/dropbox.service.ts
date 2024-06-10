import { Inject, Injectable } from '@nestjs/common';
import { DropboxAuthenticationResponseDTO } from './dtos/dropbox-access-token.dto';
import { DropboxTemporaryLinkResponseDTO } from './dtos/dropbox-temporary-link-response.dto';
import { AppEnvironment } from '../../enums/app-environment.enum';
import { HttpClientService } from '../http-client/http-client.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { DropboxUploadFileResponseDTO } from './dtos/dropbox-upload-file-response.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DropboxService {
    private authHeaders = {}

    constructor(
        private readonly httpClientService: HttpClientService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        @Inject(AppEnvironment.DROPBOX_AUTH_TOKEN)
        private readonly dropboxAuthToken: string,
        @Inject(AppEnvironment.DROPBOX_REFRESH_TOKEN)
        private readonly dropboxRefreshToken: string,
        @Inject(AppEnvironment.DROPBOX_BASE_URL)
        private readonly dropboxBaseUrl: string,
        @Inject(AppEnvironment.DROPBOX_PASTE_DIRECTORY)
        private readonly dropboxPasteDirectory: string,
    ) {
        this.authHeaders = {
            "Authorization" : `Basic ${this.dropboxAuthToken}`,
            "Content-Type": "application/json"
        }
    }

    async authenticate() : Promise<DropboxAuthenticationResponseDTO>{
        const cacheKey = `Dropbox:Authentication`;
        const cachedEntity = await this.cacheManager.get<DropboxAuthenticationResponseDTO>(cacheKey);
        if (typeof cachedEntity !== 'undefined') return cachedEntity;

        const response = await this.httpClientService.post<any, DropboxAuthenticationResponseDTO>(
            `${this.dropboxBaseUrl}/oauth2/token?grant_type=refresh_token&refresh_token=${this.dropboxRefreshToken}`, 
            null, 
            { headers: this.authHeaders }
        );
        const expiresInMiliseconds = response.expires_in * 1000
        this.cacheManager.set(cacheKey, response, expiresInMiliseconds);
        return response
    }

    async getImage(filename: string) : Promise<DropboxTemporaryLinkResponseDTO> {
        const directory = `/${this.dropboxPasteDirectory}/${filename}`
        const authData = await this.authenticate()
        const headers = {
            "Authorization" : `Bearer ${authData.access_token}`,
            "Content-Type": "application/json"
        }
        const body = { "path": directory }
        const response = this.httpClientService.post<any, DropboxTemporaryLinkResponseDTO>(`${this.dropboxBaseUrl}/2/files/get_temporary_link`, body, { headers: headers })
        return response
    }

    async uploadImage(imageUrl: string, imageFormat: string) : Promise<DropboxUploadFileResponseDTO> {
        const imageResponse = await this.httpClientService.get<any>(imageUrl, { responseType: "arraybuffer" })
        const imageBytes = Buffer.from(imageResponse, 'binary')
        const guid = uuidv4();

        const directory = `/${this.dropboxPasteDirectory}/${guid}.${imageFormat}`
        const authData = await this.authenticate()
        const headers = {
            "Authorization" : `Bearer ${authData.access_token}`,
            "Content-Type": "application/octet-stream",
            "Dropbox-API-Arg": JSON.stringify({
                "autorename": false,
                "mode": "add",
                "mute": false,
                "path": directory,
                "strict_conflict": false
            })
        }

        const response = await this.httpClientService.post<any, DropboxUploadFileResponseDTO>(
            `https://content.dropboxapi.com/2/files/upload`, 
            imageBytes, 
            { 
                headers: headers,
            }
        )

        return response
    }
}
