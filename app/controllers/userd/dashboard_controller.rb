module Userd
  class DashboardController < ApplicationController
    before_action :authenticate_user!
    before_action :require_user

    def index
      @user = current_user
    end

    private

    def require_user
      unless current_user.user?
        flash[:alert] = "You need to be a member to access this area."
        redirect_to root_path
      end
    end
  end
end
