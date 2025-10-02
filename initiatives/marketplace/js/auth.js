/**
 * Soller - Authentication System
 * Sistema completo de autenticação com verificação por código
 */

class SollerAuth {
    constructor() {
        this.currentForm = 'login';
        this.selectedUserType = 'influencer';
        this.verificationEmail = null;
        
        // Mock de banco de dados (substituir por API real)
        this.mockUsers = {
            influencers: [],
            companies: [],
            agencies: []
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        // A principal mudança: chamamos o handler de hash ao iniciar.
        this.handleUrlHash();
        // Também adicionamos um listener para mudanças futuras no hash.
        window.addEventListener('hashchange', () => this.handleUrlHash());
        this.loadSavedEmail();
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const targetTab = e.currentTarget.dataset.tab;
                // Ao clicar na aba, atualizamos o hash da URL
                window.location.hash = targetTab;
            });
        });

        // User type selection
        document.querySelectorAll('input[name="user-type"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.selectedUserType = e.target.value;
                this.toggleConditionalFields();
            });
        });

        // Form submissions
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        document.getElementById('forgot-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleForgotPassword();
        });

        // Forgot password link
        document.getElementById('forgot-password').addEventListener('click', (e) => {
            e.preventDefault();
            // Ao clicar em 'esqueceu a senha?', atualizamos o hash para '#forgot'
            window.location.hash = 'forgot';
        });

        // Back button
        document.querySelector('.btn-back')?.addEventListener('click', () => {
            // Ao clicar em 'voltar', atualizamos o hash para '#login'
            window.location.hash = 'login';
        });

        // Password visibility toggle
        document.querySelectorAll('.toggle-password').forEach(btn => {
            btn.addEventListener('click', () => {
                this.togglePasswordVisibility(btn);
            });
        });

        // Password strength indicator
        document.getElementById('register-password').addEventListener('input', (e) => {
            this.updatePasswordStrength(e.target.value);
        });

        // Remember me
        const rememberCheckbox = document.getElementById('remember-me');
        if (rememberCheckbox) {
            rememberCheckbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    localStorage.setItem('soller_remember', 'true');
                } else {
                    localStorage.removeItem('soller_remember');
                }
            });
        }

        // Social login buttons
        document.querySelectorAll('.btn-social').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const provider = btn.classList.contains('google') ? 'google' : 'instagram';
                this.handleSocialLogin(provider);
            });
        });
    }

    // Método para ler o hash da URL e controlar a navegação
    handleUrlHash() {
        const hash = window.location.hash.substring(1); // Remove o '#'
        const validHashes = ['login', 'register', 'forgot'];
        const targetTab = validHashes.includes(hash) ? hash : 'login';
        this.switchTab(targetTab);
    }
    
    switchTab(tab) {
        // Update tabs
        document.querySelectorAll('.auth-tab').forEach(t => {
            t.classList.toggle('active', t.dataset.tab === tab);
        });

        // Update forms
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
        });

        // A lógica de exibição de formulário deve ser centralizada aqui
        if (tab === 'login') {
            document.getElementById('login-form').classList.add('active');
        } else if (tab === 'register') {
            document.getElementById('register-form').classList.add('active');
        } else if (tab === 'forgot') {
            document.getElementById('forgot-form').classList.add('active');
        }

        this.currentForm = tab;
        this.clearMessages();
    }
    
    // O método showForgotForm() se torna desnecessário com a lógica de hash
    // pois a transição agora é tratada pelo handleUrlHash()

    toggleConditionalFields() {
        // Hide all conditional fields
        document.querySelectorAll('.conditional-fields').forEach(field => {
            field.style.display = 'none';
        });

        // Show relevant fields
        const fieldId = `${this.selectedUserType}-fields`;
        const field = document.getElementById(fieldId);
        if (field) {
            field.style.display = 'block';
        }
    }

    togglePasswordVisibility(button) {
        const input = button.parentElement.querySelector('input');
        const icon = button.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }

    updatePasswordStrength(password) {
        const strengthBar = document.querySelector('.strength-fill');
        const strengthText = document.querySelector('.strength-text');
        
        let strength = 0;
        let strengthClass = '';
        let strengthMessage = 'Digite uma senha';

        if (password.length > 0) {
            // Check length
            if (password.length >= 8) strength += 25;
            if (password.length >= 12) strength += 25;
            
            // Check for uppercase
            if (/[A-Z]/.test(password)) strength += 25;
            
            // Check for numbers
            if (/[0-9]/.test(password)) strength += 12.5;
            
            // Check for special characters
            if (/[^A-Za-z0-9]/.test(password)) strength += 12.5;

            if (strength <= 25) {
                strengthClass = 'weak';
                strengthMessage = 'Senha muito fraca';
            } else if (strength <= 50) {
                strengthClass = 'fair';
                strengthMessage = 'Senha fraca';
            } else if (strength <= 75) {
                strengthClass = 'good';
                strengthMessage = 'Senha boa';
            } else {
                strengthClass = 'strong';
                strengthMessage = 'Senha forte';
            }
        }

        strengthBar.className = 'strength-fill ' + strengthClass;
        strengthBar.style.width = strength + '%';
        strengthText.textContent = strengthMessage;
    }

    async handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const remember = document.getElementById('remember-me').checked;

        // Clear previous errors
        this.clearFieldErrors();

        // Validate
        if (!this.validateEmail(email)) {
            this.showFieldError('login-email', 'Email inválido');
            return;
        }

        if (password.length < 8) {
            this.showFieldError('login-password', 'Senha deve ter pelo menos 8 caracteres');
            return;
        }

        // Show loading
        this.setButtonLoading('login-button', true);

        try {
            // Simulate API call
            await this.simulateApiCall();

            // Mock authentication
            const user = this.authenticateUser(email, password);
            
            if (user) {
                // Save session
                if (remember) {
                    localStorage.setItem('soller_user_email', email);
                }
                sessionStorage.setItem('soller_user', JSON.stringify(user));
                
                this.showMessage('login-message', 'Login realizado com sucesso!', 'success');
                
                // Redirect based on user type
                setTimeout(() => {
                    this.redirectToDashboard(user.type);
                }, 1500);
            } else {
                this.showMessage('login-message', 'Email ou senha incorretos', 'error');
            }
        } catch (error) {
            this.showMessage('login-message', 'Erro ao fazer login. Tente novamente.', 'error');
        } finally {
            this.setButtonLoading('login-button', false);
        }
    }

    async handleRegister() {
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const termsAgreed = document.getElementById('terms-agree').checked;

        // Clear previous errors
        this.clearFieldErrors();

        // Validate
        let hasError = false;

        if (name.length < 3) {
            this.showFieldError('register-name', 'Nome deve ter pelo menos 3 caracteres');
            hasError = true;
        }

        if (!this.validateEmail(email)) {
            this.showFieldError('register-email', 'Email inválido');
            hasError = true;
        }

        if (password.length < 8) {
            this.showFieldError('register-password', 'Senha deve ter pelo menos 8 caracteres');
            hasError = true;
        }

        if (!termsAgreed) {
            this.showFieldError('terms', 'Você deve aceitar os termos');
            hasError = true;
        }

        if (hasError) return;

        // Show loading
        this.setButtonLoading('register-button', true);

        try {
            // Simulate API call
            await this.simulateApiCall();

            // Create user object
            const newUser = {
                id: Date.now(),
                name,
                email,
                type: this.selectedUserType,
                verified: false,
                createdAt: new Date().toISOString()
            };

            // Add type-specific fields
            if (this.selectedUserType === 'influencer') {
                newUser.handle = document.getElementById('register-handle')?.value || '';
            } else if (this.selectedUserType === 'company') {
                newUser.company = document.getElementById('register-company')?.value || '';
            } else if (this.selectedUserType === 'agency') {
                newUser.agency = document.getElementById('register-agency')?.value || '';
            }

            // Save to mock database
            this.mockUsers[this.selectedUserType + 's'].push(newUser);

            // Generate and send verification code
            const verificationCode = this.generateVerificationCode();
            await this.sendVerificationEmail(email, verificationCode);

            // Store verification data
            sessionStorage.setItem('soller_pending_verification', JSON.stringify({
                user: newUser,
                code: verificationCode,
                email: email,
                expiresAt: Date.now() + 15 * 60 * 1000 // 15 minutes
            }));

            this.showMessage('register-message', 'Conta criada! Enviamos um código de verificação para seu email.', 'success');

            // Redirect to verification page
            setTimeout(() => {
                window.location.href = `verification.html?email=${encodeURIComponent(email)}&type=email`;
            }, 2000);

        } catch (error) {
            this.showMessage('register-message', 'Erro ao criar conta. Tente novamente.', 'error');
        } finally {
            this.setButtonLoading('register-button', false);
        }
    }

    async handleForgotPassword() {
        const email = document.getElementById('forgot-email').value;

        // Clear previous errors
        this.clearFieldErrors();

        // Validate
        if (!this.validateEmail(email)) {
            this.showFieldError('forgot-email', 'Email inválido');
            return;
        }

        // Show loading
        this.setButtonLoading('recovery-button', true);

        try {
            // Simulate API call
            await this.simulateApiCall();

            // Generate recovery code
            const recoveryCode = this.generateVerificationCode();
            
            // Store recovery data
            sessionStorage.setItem('soller_password_recovery', JSON.stringify({
                email: email,
                code: recoveryCode,
                expiresAt: Date.now() + 15 * 60 * 1000 // 15 minutes
            }));

            // Send recovery email (mock)
            await this.sendRecoveryEmail(email, recoveryCode);

            this.showMessage('forgot-message', 'Código de recuperação enviado para seu email!', 'success');

            // Redirect to verification page
            setTimeout(() => {
                window.location.href = `verification.html?email=${encodeURIComponent(email)}&type=password`;
            }, 2000);

        } catch (error) {
            this.showMessage('forgot-message', 'Erro ao enviar código. Tente novamente.', 'error');
        } finally {
            this.setButtonLoading('recovery-button', false);
        }
    }

    async handleSocialLogin(provider) {
        console.log(`Social login with ${provider}`);
        
        // Show loading state
        const button = event.currentTarget;
        button.disabled = true;
        button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Conectando...`;

        try {
            // Simulate OAuth flow
            await this.simulateApiCall();

            // Mock OAuth response
            const mockUser = {
                id: Date.now(),
                name: 'Usuário Social',
                email: `user${Date.now()}@${provider}.com`,
                type: 'influencer',
                provider: provider,
                verified: true
            };

            // Save session
            sessionStorage.setItem('soller_user', JSON.stringify(mockUser));

            // Show success
            this.showMessage(
                this.currentForm === 'register' ? 'register-message' : 'login-message',
                `Conectado com ${provider}!`,
                'success'
            );

            // Redirect
            setTimeout(() => {
                this.redirectToDashboard(mockUser.type);
            }, 1500);

        } catch (error) {
            this.showMessage(
                this.currentForm === 'register' ? 'register-message' : 'login-message',
                `Erro ao conectar com ${provider}`,
                'error'
            );
        } finally {
            // Restore button
            button.disabled = false;
            button.innerHTML = provider === 'google' 
                ? '<i class="fab fa-google"></i> Google'
                : '<i class="fab fa-instagram"></i> Instagram';
        }
    }

    // Helper methods
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    generateVerificationCode() {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }

    async sendVerificationEmail(email, code) {
        // Mock email sending
        console.log(`Sending verification code ${code} to ${email}`);
        await this.simulateApiCall();
    }

    async sendRecoveryEmail(email, code) {
        // Mock email sending
        console.log(`Sending recovery code ${code} to ${email}`);
        await this.simulateApiCall();
    }

    authenticateUser(email, password) {
        // Mock authentication - in production, this would be an API call
        // For demo purposes, accept any email/password
        return {
            id: Date.now(),
            email: email,
            name: 'Demo User',
            type: 'influencer',
            verified: true
        };
    }

    redirectToDashboard(userType) {
        // Redirect based on user type
        const redirectMap = {
            'influencer': 'dashboard-influencer.html',
            'company': 'dashboard-company.html',
            'agency': 'dashboard-agency.html'
        };

        window.location.href = redirectMap[userType] || 'index.html';
    }

    simulateApiCall(delay = 1000) {
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    setButtonLoading(buttonId, loading) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = loading;
            button.classList.toggle('loading', loading);
        }
    }

    showMessage(containerId, message, type) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="${type}-message">
                    <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
                    ${message}
                </div>
            `;
        }
    }

    showFieldError(fieldId, message) {
        const errorElement = document.getElementById(`${fieldId}-error`);
        if (errorElement) {
            errorElement.textContent = message;
        }
        
        // Add error styling to input
        const input = document.getElementById(fieldId);
        if (input) {
            input.parentElement.classList.add('has-error');
        }
    }

    clearFieldErrors() {
        document.querySelectorAll('.field-error').forEach(error => {
            error.textContent = '';
        });
        
        document.querySelectorAll('.has-error').forEach(element => {
            element.classList.remove('has-error');
        });
    }

    clearMessages() {
        document.querySelectorAll('.message-container').forEach(container => {
            container.innerHTML = '';
        });
    }

    checkUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const tab = urlParams.get('tab');
        
        if (tab === 'register') {
            this.switchTab('register');
        }

        // Check if coming from verification
        if (urlParams.get('verified') === 'true') {
            this.showMessage('login-message', 'Email verificado com sucesso! Faça login para continuar.', 'success');
        }
    }

    loadSavedEmail() {
        const savedEmail = localStorage.getItem('soller_user_email');
        if (savedEmail) {
            document.getElementById('login-email').value = savedEmail;
            document.getElementById('remember-me').checked = true;
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SollerAuth();
});