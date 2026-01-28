class Rack::Attack
  Rack::Attack.cache.store = ActiveSupport::Cache::MemoryStore.new 

  safelist("allow-localhost") do |req|
    "127.0.0.1" == req.ip || "::1" == req.ip
  end

  safelist("allow-cors-preflight") do |req|
    req.request_method == "OPTIONS"
  end

  throttle("login/ip", limit: 5, period: 60.seconds) do |req|
    if req.path == "/login" && req.post?
      req.ip
    end
  end

  throttle("refresh/ip", limit: 10, period: 60.seconds) do |req|
    if req.path == "/refresh" && req.post?
      req.ip
    end
  end

  throttle("req/ip", limit: 300, period: 1.minute) do |req|
    req.ip
  end

  self.throttled_responder = lambda do |env|
    match_data = env["rack.attack.match_data"]
    now = match_data[:epoch_time]
    retry_after = (match_data[:period] - (now % match_data[:period])).to_i

    [ 429, 
      { "Content-Type" => "application/json", "Retry-After" => retry_after.to_s },
      [{ error: "Too many requests. Try after #{retry_after} seconds." }.to_json]
    ]
  end
end