import { Api } from './Api'
import { Client } from '../types'

/**
 * Содержит методы для получения и обновления информации о клиенте
 */
export class ClientApi extends Api {
    module = '/client';

    /**
     * Позволяет проверить, зарегистрирована ли карта с номером в системе
     *
     * @param {string} card Номер карты
     * @returns {Promise<void>}
     */
    checkCard (card: string): Promise<void> {
        return this.post('/check-card', { card }) as Promise<void>
    }

    /**
     * Создает новый аккаунт клиента, связанный с аккаунтом в системе Контур
     *
     * @param {string} card Номер карты
     * @param {string} password Пароль
     * @returns {Promise<void>}
     */
    register (card: string, password: string): Promise<void> {
        return this.post('/register', { card, password }) as Promise<void>
    }

    /**
     * При успешной авторизации открывает сессию и возвращает объект с информацией о клиенте
     *
     * @param {string} username Email, номер телефона или логин
     * @param {string} password Пароль
     * @returns {Promise<Client>} Авторизованный клиент
     */
    authorize (username: string, password: string): Promise<Client> {
        return (this.post('/auth', {username, password}) as Promise<{ accessToken: string }>)
            .then(({ accessToken }) => localStorage.setItem('accessToken', accessToken))
            .then(() => this.getAuthorized())
    }

    /**
     * При наличии сессии на сервере возвращает авторизованного клиента
     *
     * @returns {Promise<Client>} Авторизованный клиент
     */
    getAuthorized (): Promise<Client> {
        return new Promise((resolve) => {
            resolve({
                id: 1,
                firstName: 'Джон',
                lastName: 'Коннор',
                phone: '88005553535',
                email: 'for-shit@bk.ru',
                card: '123123',
                registered: new Date()
            })
        })
        //return this.get('/authorized') as Promise<Client>
    }

    /**
     * Завершает сессию пользователя
     */
    public logOut (): void {
        localStorage.removeItem('accessToken')
    }
}
