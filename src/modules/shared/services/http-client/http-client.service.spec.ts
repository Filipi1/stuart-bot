import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AxiosRequestConfig } from 'axios';
import { of } from 'rxjs';

import { HttpClientService } from './http-client.service';

class AxiosError extends Error {
  response: {
    status: number;
    data: any;
  };
}

const makeAxiosError = (status: number): AxiosError => {
  const responseError = new AxiosError('error');
  responseError.response = {
    status,
    data: 'error',
  };
  return responseError;
};

describe('HttpClientService', () => {
  const response = { data: { id: 1 } };
  const url = 'teste';
  const config: AxiosRequestConfig = {
    baseURL: 'http://localhost:3000',
  };
  let httpServiceMock: HttpService;
  let httpClientService: HttpClientService;
  const HttpServiceProvider = {
    provide: HttpService,
    useValue: {
      get: jest.fn().mockReturnValue(of(response)),
      post: jest.fn().mockReturnValue(of(response)),
      patch: jest.fn().mockReturnValue(of(response)),
    },
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [HttpServiceProvider, HttpClientService],
    }).compile();
    httpClientService = app.get(HttpClientService);
    httpServiceMock = app.get(HttpService);
  });

  it('should be defined', () => {
    expect(httpClientService).toBeDefined();
    expect(httpServiceMock).toBeDefined();
  });

  describe('get', () => {
    it('should call httpService with correct values', async () => {
      await httpClientService.get(url, config);
      expect(httpServiceMock.get).toHaveBeenCalledWith(url, config);
    });

    it('should return correct value', async () => {
      const result = await httpClientService.get(url, config);
      expect(result).toEqual(response.data);
    });

    it('should throw exception if httpService throws exception', async () => {
      jest.spyOn(httpServiceMock, 'get').mockImplementationOnce(() => {
        throw new Error();
      });
      await expect(httpClientService.get(url, config)).rejects.toThrow();
    });

    it('should throw HttpException if httpService throws internal server error', async () => {
      const axiosError = makeAxiosError(500);
      jest.spyOn(httpServiceMock, 'get').mockImplementationOnce(() => {
        throw axiosError;
      });
      await expect(httpClientService.get(url, config)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw NotFoundException if httpService throws not found error', async () => {
      const axiosError = makeAxiosError(404);
      jest.spyOn(httpServiceMock, 'get').mockImplementationOnce(() => {
        throw axiosError;
      });
      await expect(httpClientService.get(url, config)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if httpService throws bad request error', async () => {
      const axiosError = makeAxiosError(400);
      jest.spyOn(httpServiceMock, 'get').mockImplementationOnce(() => {
        throw axiosError;
      });
      await expect(httpClientService.get(url, config)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('post', () => {
    const data = { name: 'teste' };

    it('should call httpService with correct values', async () => {
      await httpClientService.post(url, data, config);
      expect(httpServiceMock.post).toHaveBeenCalledWith(url, data, config);
    });

    it('should return correct value', async () => {
      const result = await httpClientService.post(url, data, config);
      expect(result).toEqual(response.data);
    });

    it('should throw exception if httpService throws exception', async () => {
      jest.spyOn(httpServiceMock, 'post').mockImplementationOnce(() => {
        throw new Error();
      });
      await expect(httpClientService.post(url, data, config)).rejects.toThrow(
        Error,
      );
    });
  });

  describe('patch', () => {
    const data = { name: 'teste' };

    it('should call httpService with correct values', async () => {
      await httpClientService.patch(url, data, config);
      expect(httpServiceMock.patch).toHaveBeenCalledWith(url, data, config);
    });

    it('should return correct value', async () => {
      const result = await httpClientService.patch(url, data, config);
      expect(result).toEqual(response.data);
    });

    it('should throw exception if httpService throws exception', async () => {
      jest.spyOn(httpServiceMock, 'patch').mockImplementationOnce(() => {
        throw new Error();
      });
      await expect(httpClientService.patch(url, data, config)).rejects.toThrow(
        Error,
      );
    });
  });
});
