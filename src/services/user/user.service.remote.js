import { showErrorMsg } from '../event-bus.service'
import { httpService } from '../http.service'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

export const userService = {
	login,
	logout,
	signup,
	getUsers,
	getById,
	remove,
	update,
	getLoggedinUser,
	saveLoggedinUser,
	addActivity
}

function getUsers() {
	return httpService.get(`user`)
}

async function getById(userId) {
	const user = await httpService.get(`user/${userId}`)
	return user
}

function remove(userId) {
	return httpService.delete(`user/${userId}`)
}

async function update({ _id, score }) {
	const user = await httpService.put(`user/${_id}`, { _id, score })

	// When admin updates other user's details, do not update loggedinUser
	const loggedinUser = getLoggedinUser() // Might not work because its defined in the main service???
	if (loggedinUser._id === user._id) saveLoggedinUser(user)

	return user
}

async function login(userCred) {
	try {
		const user = await httpService.post('auth/login', userCred)

		if (user && user.username !== 'Guest') return saveLoggedinUser(user)


	} catch (err) {
		console.log('err:', err);
		return showErrorMsg('Email or password incorrect')
	}
}

async function signup(userCred) {
	userCred.imgUrl = userCred.imgUrl ? userCred.imgUrl : '/img/user/user-default.png'

	console.log('after', userCred)
	try {
		const user = await httpService.post('auth/signup', userCred)
		return saveLoggedinUser(user)
	} catch (err) {
		console.error('can not login', err)
	}
}

async function logout() {
	sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
	return await httpService.post('auth/logout')
}

function getLoggedinUser() {
	return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER)) || { _id: '673a4e6607432cd340d8bdb2', fullname: 'Guest', imgUrl: '/img/user/user-default.png' }
}

function saveLoggedinUser(user) {
	user = {
		_id: user._id,
		fullname: user.fullname,
		imgUrl: user.imgUrl,
		// score: user.score, 
		isAdmin: user.isAdmin
	}

	console.log('user', user)
	sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
	return user
}

async function addActivity(txt) {
	const activity = {
		txt,
		at: Date.now()
	}
	const loggedinUser = getLoggedinUser()
	if (!loggedinUser) return Promise.reject('No loggedin user')
	try {
		const user = await getById(loggedinUser._id)
		if (!user.activities) user.activities = []
		user.activities.unshift(activity)
		return _saveUser(user)
	} catch (err) {
		console.error('can not add activity', err)
	}
}