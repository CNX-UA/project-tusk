Rails.application.routes.draw do

  get '/csrf', to: 'application#csrf'
  
  devise_for :users,
              path: "",
              path_names: {
              sign_in: "login",
              sign_out: "logout",
              registration: "signup"
              },
              controllers: {
                sessions: "users/sessions",
                registrations: "users/registrations",
                omniauth_callbacks: "users/omniauth_callbacks"
              },
              defaults: { format: :json }

  post '/refresh', to: 'users/refresh#create'
  
  namespace :api do
    namespace :v1 do
      resources :users, only: %i[index show]
      resources :projects, only: %i[index show create update destroy] do
        resources :tasks, only: %i[index create]
        resources :attachments, only: %i[index create]
      end
      resources :tasks, only: %i[show update destroy] do
        resources :comments, only: %i[index create]
        resources :attachments, only: %i[index create]
      end
      resources :comments, only: %i[destroy] do
        resources :attachments, only: %i[index create]
      end
      resources :attachments, only: %i[destroy]
      resources :teams, only: %i[index show create update destroy] do
        resources :memberships, controller: :team_memberships, only: %i[index create destroy]
      end
    end
  end
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end
