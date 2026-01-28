Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do

    #change "*" later, to the domain of frontend
    origins "*"

    #leave "*" be for now, might change in the future
    resource "*",
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],

      expose: ["Authorization"],

      credentials: true
  end
end