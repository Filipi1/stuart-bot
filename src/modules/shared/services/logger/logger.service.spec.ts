import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let sut: LoggerService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [LoggerService],
    }).compile();

    sut = await app.resolve(LoggerService);
    sut.setLogLevels([]);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('setContext', () => {
    it('should call setContext', () => {
      const spy = jest.spyOn(sut, 'setContext');
      sut.setContext('setContext');
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('log', () => {
    it('should call log', () => {
      const spy = jest.spyOn(sut, 'log');
      sut.log('log');
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('error', () => {
    it('should call error', () => {
      const spy = jest.spyOn(sut, 'error');
      sut.error('error');
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('warn', () => {
    it('should call warn', () => {
      const spy = jest.spyOn(sut, 'warn');
      sut.warn('warn');
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('debug', () => {
    it('should call debug', () => {
      const spy = jest.spyOn(sut, 'debug');
      sut.debug('debug');
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('verbose', () => {
    it('should call verbose', () => {
      const spy = jest.spyOn(sut, 'verbose');
      sut.verbose('verbose');
      expect(spy).toHaveBeenCalled();
    });
  });
});
