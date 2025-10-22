/**
 * Soller - Verification System
 * Sistema de verificação por código de 4 dígitos
 */

class SollerVerification {
    constructor() {
        this.verificationType = null; // 'email' or 'password'
        this.userEmail = null;
        this.resendCooldown = 60; // seconds
        this.resendTimer = null;
        this.verificationCode = null;
        this.attempts = 0;
        this.maxAttempts = 5;
        
        this.init();
    }

    init() {
        this.parseUrlParams();
        this.loadVerificationData();
        this.setupUI();
        this.setupEventListeners();
        this.focusFirstInput();
    }

    parseUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        this.verificationType = urlParams.get('type') || 'email';
        this.userEmail = urlParams.get('email');
        
        // Redirect if missing required params
        if (!this.userEmail) {
            console.warn('Missing email parameter, redirecting to auth');
            window.location.href = 'auth.html';
            return;
        }
        
        // Decode email
        this.userEmail = decodeURIComponent(this.userEmail);
    }

    loadVerificationData() {
        // Load verification data from session storage
        if (this.verificationType === 'email') {
            const pendingVerification = sessionStorage.getItem('soller_pending_verification');
            if (pendingVerification) {
                const data = JSON.parse(pendingVerification);
                this.verificationCode = data.code;
                
                // Check if expired
                if (Date.now() > data.expiresAt) {
                    this.showError('Código expirado. Solicite um novo código.');
                    this.verificationCode = null;
                }
            }
        } else if (this.verificationType === 'password') {
            const passwordRecovery = sessionStorage.getItem('soller_password_recovery');
            if (passwordRecovery) {
                const data = JSON.parse(passwordRecovery);
                this.verificationCode = data.code;
                
                // Check if expired
                if (Date.now() > data.expiresAt) {
                    this.showError('Código expirado. Solicite um novo código.');
                    this.verificationCode = null;
                }
            }
        }
    }

    setupUI() {
        // Update icon based on type
        const icon = document.getElementById('verification-icon');
        if (this.verificationType === 'password') {
            icon.className = 'fas fa-lock';
        }

        // Update texts
        const title = document.getElementById('verification-title');
        const subtitle = document.getElementById('verification-subtitle');
        const emailDisplay = document.getElementById('verification-email');
        
        if (this.verificationType === 'password') {
            title.textContent = 'Recuperar Senha';
            subtitle.textContent = 'Digite o código de recuperação enviado para:';
        } else {
            title.textContent = 'Verificar Email';
            subtitle.textContent = 'Digite o código de verificação enviado para:';
        }
        
        emailDisplay.textContent = this.userEmail;
    }

    setupEventListeners() {
        // Code input handling
        this.setupCodeInputs();
        
        // Form submission
        const form = document.getElementById('verification-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.verifyCode();
        });
        
        // Resend button
        const resendButton = document.getElementById('resend-button');
        resendButton.addEventListener('click', () => {
            this.resendCode();
        });

        // Continue button (success state)
        const continueButton = document.getElementById('continue-button');
        if (continueButton) {
            continueButton.addEventListener('click', () => {
                this.redirectAfterSuccess();
            });
        }
    }

    setupCodeInputs() {
        const digits = document.querySelectorAll('.code-digit');
        
        digits.forEach((digit, index) => {
            // Input event
            digit.addEventListener('input', (e) => {
                const value = e.target.value;
                
                // Only allow numbers
                if (!/^\d$/.test(value) && value !== '') {
                    e.target.value = '';
                    return;
                }
                
                // Add filled class
                if (value) {
                    e.target.classList.add('filled');
                } else {
                    e.target.classList.remove('filled');
                }
                
                // Move to next input
                if (value && index < digits.length - 1) {
                    digits[index + 1].focus();
                }
                
                // Auto-submit if all digits filled
                if (index === digits.length - 1 && value) {
                    const allFilled = Array.from(digits).every(d => d.value);
                    if (allFilled) {
                        setTimeout(() => this.verifyCode(), 100);
                    }
                }
            });
            
            // Keydown event for backspace
            digit.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace') {
                    if (!e.target.value && index > 0) {
                        // Move to previous input
                        e.preventDefault();
                        digits[index - 1].focus();
                        digits[index - 1].value = '';
                        digits[index - 1].classList.remove('filled');
                    }
                }
                
                // Arrow key navigation
                if (e.key === 'ArrowLeft' && index > 0) {
                    e.preventDefault();
                    digits[index - 1].focus();
                }
                if (e.key === 'ArrowRight' && index < digits.length - 1) {
                    e.preventDefault();
                    digits[index + 1].focus();
                }
            });
            
            // Paste event
            digit.addEventListener('paste', (e) => {
                e.preventDefault();
                const paste = (e.clipboardData || window.clipboardData).getData('text');
                const pasteDigits = paste.replace(/\D/g, '').slice(0, 4);
                
                if (pasteDigits.length === 4) {
                    pasteDigits.split('').forEach((value, i) => {
                        if (digits[i]) {
                            digits[i].value = value;
                            digits[i].classList.add('filled');
                        }
                    });
                    
                    // Focus last input and auto-submit
                    digits[3].focus();
                    setTimeout(() => this.verifyCode(), 100);
                }
            });

            // Focus event
            digit.addEventListener('focus', (e) => {
                e.target.select();
            });
        });
    }

    focusFirstInput() {
        setTimeout(() => {
            document.getElementById('digit-1')?.focus();
        }, 100);
    }

    async verifyCode() {
        const code = this.getEnteredCode();
        
        if (code.length !== 4) {
            this.showError('Digite o código completo de 4 dígitos');
            this.shakeInputs();
            return;
        }

        // Check attempts
        this.attempts++;
        if (this.attempts >= this.maxAttempts) {
            this.showError('Muitas tentativas. Solicite um novo código.');
            this.disableInputs();
            return;
        }

        // Show loading
        this.setButtonLoading(true);
        
        try {
            // Simulate API call
            await this.simulateApiCall();
            
            // Verify code (mock verification)
            if (code === this.verificationCode || code === '1234') { // '1234' for testing
                await this.handleSuccessfulVerification();
            } else {
                this.handleFailedVerification();
            }
            
        } catch (error) {
            this.showError('Erro ao verificar código. Tente novamente.');
        } finally {
            this.setButtonLoading(false);
        }
    }

    async handleSuccessfulVerification() {
        if (this.verificationType === 'email') {
            // Mark email as verified
            const pendingVerification = sessionStorage.getItem('soller_pending_verification');
            if (pendingVerification) {
                const data = JSON.parse(pendingVerification);
                data.user.verified = true;
                
                // Save verified user
                sessionStorage.setItem('soller_user', JSON.stringify(data.user));
                sessionStorage.removeItem('soller_pending_verification');
            }
            
            this.showSuccessState('Email Verificado!', 'Sua conta foi verificada com sucesso.');
            
        } else if (this.verificationType === 'password') {
            // Prepare for password reset
            sessionStorage.setItem('soller_reset_token', JSON.stringify({
                email: this.userEmail,
                token: this.generateToken(),
                expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
            }));
            sessionStorage.removeItem('soller_password_recovery');
            
            this.showSuccessState('Código Verificado!', 'Você será redirecionado para criar uma nova senha.');
        }
        
        // Auto redirect after 2 seconds
        setTimeout(() => {
            this.redirectAfterSuccess();
        }, 2000);
    }

    handleFailedVerification() {
        const remainingAttempts = this.maxAttempts - this.attempts;
        
        if (remainingAttempts > 0) {
            this.showError(`Código incorreto. ${remainingAttempts} tentativa(s) restante(s).`);
        } else {
            this.showError('Muitas tentativas. Solicite um novo código.');
            this.disableInputs();
        }
        
        this.clearInputs();
        this.shakeInputs();
    }

    showSuccessState(title, text) {
        // Hide verification card
        document.querySelector('.verification-card').style.display = 'none';
        
        // Show success card
        const successCard = document.getElementById('success-card');
        successCard.style.display = 'block';
        
        // Update texts
        document.getElementById('success-title').textContent = title;
        document.getElementById('success-text').textContent = text;
    }

    redirectAfterSuccess() {
        if (this.verificationType === 'email') {
            // Redirect to login with success message
            window.location.href = 'auth.html?verified=true';
        } else if (this.verificationType === 'password') {
            // Redirect to password reset page
            window.location.href = `reset-password.html?email=${encodeURIComponent(this.userEmail)}`;
        }
    }

    async resendCode() {
        const button = document.getElementById('resend-button');
        
        if (button.disabled) return;
        
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        
        try {
            // Simulate API call
            await this.simulateApiCall();
            
            // Generate new code
            const newCode = this.generateCode();
            this.verificationCode = newCode;
            
            // Update session storage
            if (this.verificationType === 'email') {
                const pendingVerification = sessionStorage.getItem('soller_pending_verification');
                if (pendingVerification) {
                    const data = JSON.parse(pendingVerification);
                    data.code = newCode;
                    data.expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes
                    sessionStorage.setItem('soller_pending_verification', JSON.stringify(data));
                }
            } else {
                sessionStorage.setItem('soller_password_recovery', JSON.stringify({
                    email: this.userEmail,
                    code: newCode,
                    expiresAt: Date.now() + 15 * 60 * 1000
                }));
            }
            
            // Reset attempts
            this.attempts = 0;
            this.enableInputs();
            
            this.showSuccess('Novo código enviado para seu email!');
            this.startResendCooldown();
            
            // Clear and focus inputs
            this.clearInputs();
            this.focusFirstInput();
            
        } catch (error) {
            this.showError('Erro ao reenviar código. Tente novamente.');
            button.disabled = false;
            button.innerHTML = '<i class="fas fa-redo"></i> Reenviar código';
        }
    }

    startResendCooldown() {
        const button = document.getElementById('resend-button');
        const countdown = document.getElementById('countdown');
        
        let remaining = this.resendCooldown;
        
        const updateCountdown = () => {
            if (remaining > 0) {
                countdown.textContent = `Aguarde ${remaining}s para reenviar`;
                remaining--;
                this.resendTimer = setTimeout(updateCountdown, 1000);
            } else {
                countdown.textContent = '';
                button.disabled = false;
                button.innerHTML = '<i class="fas fa-redo"></i> Reenviar código';
            }
        };
        
        updateCountdown();
    }

    getEnteredCode() {
        const digits = document.querySelectorAll('.code-digit');
        return Array.from(digits).map(digit => digit.value).join('');
    }

    clearInputs() {
        document.querySelectorAll('.code-digit').forEach(digit => {
            digit.value = '';
            digit.classList.remove('filled', 'error');
        });
    }

    shakeInputs() {
        document.querySelectorAll('.code-digit').forEach(digit => {
            digit.classList.add('error');
            setTimeout(() => {
                digit.classList.remove('error');
            }, 500);
        });
    }

    disableInputs() {
        document.querySelectorAll('.code-digit').forEach(digit => {
            digit.disabled = true;
        });
        document.getElementById('verify-button').disabled = true;
    }

    enableInputs() {
        document.querySelectorAll('.code-digit').forEach(digit => {
            digit.disabled = false;
        });
        document.getElementById('verify-button').disabled = false;
    }

    setButtonLoading(loading) {
        const button = document.getElementById('verify-button');
        if (button) {
            button.disabled = loading;
            button.classList.toggle('loading', loading);
        }
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showMessage(message, type) {
        const container = document.getElementById('message-container');
        if (container) {
            container.innerHTML = `
                <div class="${type}-message">
                    <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
                    ${message}
                </div>
            `;
            
            // Auto clear after 5 seconds
            setTimeout(() => {
                container.innerHTML = '';
            }, 5000);
        }
    }

    generateCode() {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }

    generateToken() {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }

    simulateApiCall(delay = 1000) {
        return new Promise(resolve => setTimeout(resolve, delay));
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SollerVerification();
});