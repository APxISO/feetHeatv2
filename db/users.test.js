// const { createUser, getUserById, getUser, getUserByUsername, getAllUsers } = require('./users');
// const bcrypt = require('bcrypt');
// const client = require('./index'); // Mock this

// jest.mock('bcrypt');
// jest.mock('./index'); // Assuming this is your database client module

// describe('createUser', () => {
//   // Test for successful user creation
//   it('should create a new user', async () => {
//     bcrypt.hash.mockResolvedValue('hashedpassword');
//     client.query.mockResolvedValue({
//       rows: [{ id: 1, username: 'testuser', isAdmin: false }]
//     });

//     const user = await createUser({ username: 'testuser', password: 'password123' });
//     expect(user).toHaveProperty('id');
//     expect(user.username).toBe('testuser');
//     expect(client.query).toBeCalledWith(expect.any(String), ['testuser', 'hashedpassword', false]);
//   });

//   // Test for handling duplicate username
//   it('should handle duplicate username error', async () => {
//     client.query.mockRejectedValue({ code: '23505' });

//     await expect(createUser({ username: 'testuser', password: 'password123' }))
//       .rejects.toEqual({ name: 'signupError', message: 'Username is already taken' });
//   });

// });


// describe('getUserById', () => {
//     it('should retrieve a user by ID', async () => {
//       client.query.mockResolvedValue({
//         rows: [{ id: 1, username: 'testuser', isAdmin: false }]
//       });
  
//       const user = await getUserById(1);
//       expect(user).toHaveProperty('id', 1);
//       expect(user.username).toBe('testuser');
//       expect(client.query).toBeCalledWith(expect.any(String), [1]);
//     });
  
//     // Test for user not found
//     it('should return null if user not found', async () => {
//       client.query.mockResolvedValue({ rows: [] });
//       const user = await getUserById(999);
//       expect(user).toBeNull();
//     });
//   });

//   describe('getUser', () => {
//     it('should authenticate a user with correct credentials', async () => {
//       client.query.mockResolvedValue({
//         rows: [{ id: 1, username: 'testuser', password: 'hashedpassword', isAdmin: false }]
//       });
//       bcrypt.compare.mockResolvedValue(true);
  
//       const user = await getUser({ username: 'testuser', password: 'password123' });
//       expect(user).toHaveProperty('id', 1);
//       expect(bcrypt.compare).toBeCalledWith('password123', 'hashedpassword');
//     });
  
//     // Test for incorrect username
//     it('should throw an error for incorrect username', async () => {
//       client.query.mockResolvedValue({ rows: [] });
//       await expect(getUser({ username: 'wronguser', password: 'password123' }))
//         .rejects.toEqual({ name: 'loginError', message: 'Incorrect username or password' });
//     });
  
    
//   });

//   describe('getUserByUsername', () => {
//     it('should retrieve a user by username', async () => {
//       client.query.mockResolvedValue({
//         rows: [{ id: 1, username: 'testuser', isAdmin: false }]
//       });
  
//       const user = await getUserByUsername('testuser');
//       expect(user).toHaveProperty('id', 1);
//       expect(client.query).toBeCalledWith(expect.any(String), ['testuser']);
//     });
  
//     // Test for user not found
//     it('should return null if user not found', async () => {
//       client.query.mockResolvedValue({ rows: [] });
//       const user = await getUserByUsername('nonexistentuser');
//       expect(user).toBeNull();
//     });
//   });

  
//   describe('getAllUsers', () => {
//     it('should retrieve all users', async () => {
//       client.query.mockResolvedValue({
//         rows: [
//           { id: 1, username: 'testuser1' },
//           { id: 2, username: 'testuser2' }
//         ]
//       });
  
//       const users = await getAllUsers();
//       expect(users.length).toBe(2);
//       expect(users[0]).toHaveProperty('id', 1);
//       expect(users[1]).toHaveProperty('id', 2);
//     });
  
//     // Test for no users
//     it('should return an empty array if no users', async () => {
//       client.query.mockResolvedValue({ rows: [] });
//       const users = await getAllUsers();
//       expect(users).toEqual([]);
//     });
//   });
  

